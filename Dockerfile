# ============================================================
# Stage 1: Build frontend assets (Node 20)
# ============================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources/ resources/
COPY tsconfig.json vite.config.js tailwind.config.js postcss.config.js ./
# Ziggy route types needed for TypeScript compilation
COPY vendor/tightenco/ziggy vendor/tightenco/ziggy

RUN npm run build

# ============================================================
# Stage 2: Install PHP dependencies (Composer)
# ============================================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# ============================================================
# Stage 3: Production runtime (PHP-FPM + Nginx)
# ============================================================
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    linux-headers \
    sqlite-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    pdo_sqlite \
    mbstring \
    zip \
    bcmath \
    gd \
    intl \
    opcache \
    pcntl

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php.ini "$PHP_INI_DIR/conf.d/99-custom.ini"

# Configure OPcache
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.enable_cli=1'; \
    } > "$PHP_INI_DIR/conf.d/opcache.ini"

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
RUN rm -f /etc/nginx/http.d/default.conf.bak

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# Copy entrypoint script first (before app code COPY overwrites context)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy application code
COPY . .

# Copy built assets from Stage 1
COPY --from=frontend /app/public/build public/build

# Copy vendor from Stage 2
COPY --from=vendor /app/vendor vendor

# Remove dev/build files not needed in production
RUN rm -rf node_modules tests .env.example \
    storage/logs/*.log \
    docker/

# Create required directories and set permissions
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
