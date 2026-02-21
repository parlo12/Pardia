#!/bin/sh
set -e

echo "==> Starting Pardia application..."

# Create storage link if it doesn't exist
if [ ! -L /var/www/html/public/storage ]; then
    php artisan storage:link
fi

# Cache configuration for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Ensure correct permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Create supervisor log directory
mkdir -p /var/log/supervisor

echo "==> Application ready. Starting services..."

# Start Supervisor (manages PHP-FPM + Nginx)
exec /usr/bin/supervisord -c /etc/supervisord.conf
