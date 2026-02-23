<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $software = Category::create([
            'name' => 'Software',
            'slug' => 'software',
            'description' => 'Digital tools and applications built to streamline your workflow.',
        ]);

        $hardware = Category::create([
            'name' => 'Hardware',
            'slug' => 'hardware',
            'description' => 'Premium hardware tools engineered for performance.',
        ]);

        $utilities = Category::create([
            'name' => 'Utilities',
            'slug' => 'utilities',
            'description' => 'Free and open-source utility tools.',
        ]);

        Product::create([
            'category_id' => $software->id,
            'name' => 'Pardia Code Editor',
            'slug' => 'pardia-code-editor',
            'description' => 'A blazing-fast, AI-powered code editor designed for modern developers. Features intelligent autocomplete, real-time collaboration, and support for 50+ programming languages. Built from the ground up with performance and extensibility in mind.',
            'short_description' => 'AI-powered code editor for modern developers.',
            'price' => 79.99,
            'is_free' => false,
            'type' => 'software',
            'version' => '2.1.0',
            'thumbnail' => '/images/products/code-editor.jpg',
            'images' => ['/images/products/code-editor-1.jpg', '/images/products/code-editor-2.jpg', '/images/products/code-editor-3.jpg'],
            'features' => ['AI Autocomplete', 'Real-time Collaboration', '50+ Languages', 'Extension Marketplace', 'Git Integration', 'Terminal Built-in'],
            'system_requirements' => ['OS' => 'Windows 10+, macOS 12+, Linux', 'RAM' => '4GB minimum', 'Storage' => '500MB'],
            'stock' => 999,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $software->id,
            'name' => 'Pardia Cloud Suite',
            'slug' => 'pardia-cloud-suite',
            'description' => 'Complete cloud infrastructure management platform. Monitor, deploy, and scale your applications with ease. Includes real-time analytics, automated backups, and one-click deployments across multiple cloud providers.',
            'short_description' => 'All-in-one cloud infrastructure management.',
            'price' => 149.99,
            'is_free' => false,
            'type' => 'software',
            'version' => '3.0.0',
            'thumbnail' => '/images/products/cloud-suite.jpg',
            'images' => ['/images/products/cloud-suite-1.jpg', '/images/products/cloud-suite-2.jpg'],
            'features' => ['Multi-Cloud Support', 'Real-time Analytics', 'Auto-scaling', 'CI/CD Pipeline', 'SSL Management', '24/7 Monitoring'],
            'system_requirements' => ['OS' => 'Any modern browser', 'RAM' => '2GB minimum', 'Storage' => 'Cloud-based'],
            'stock' => 999,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $utilities->id,
            'name' => 'Pardia File Manager',
            'slug' => 'pardia-file-manager',
            'description' => 'A lightweight, powerful file management utility. Dual-pane interface, batch renaming, advanced search with regex support, and seamless cloud storage integration. Completely free and open source.',
            'short_description' => 'Free lightweight file management utility.',
            'price' => 0,
            'is_free' => true,
            'type' => 'software',
            'download_url' => '#',
            'version' => '1.5.2',
            'thumbnail' => '/images/products/file-manager.jpg',
            'images' => ['/images/products/file-manager-1.jpg'],
            'features' => ['Dual-Pane View', 'Batch Rename', 'Regex Search', 'Cloud Integration', 'Tabbed Interface', 'Dark Mode'],
            'stock' => 999,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $hardware->id,
            'name' => 'Pardia Dev Board Pro',
            'slug' => 'pardia-dev-board-pro',
            'description' => 'Professional-grade development board with ARM Cortex-M7 processor, 512KB RAM, built-in WiFi/BLE, and extensive GPIO pins. Perfect for IoT projects, prototyping, and embedded systems development. Comes with a comprehensive SDK and documentation.',
            'short_description' => 'Professional IoT development board with ARM processor.',
            'price' => 129.99,
            'is_free' => false,
            'type' => 'hardware',
            'version' => 'Rev 3',
            'thumbnail' => '/images/products/dev-board.jpg',
            'images' => ['/images/products/dev-board-1.jpg', '/images/products/dev-board-2.jpg', '/images/products/dev-board-3.jpg'],
            'features' => ['ARM Cortex-M7', '512KB RAM', 'WiFi + BLE', '40 GPIO Pins', 'USB-C', 'SDK Included'],
            'stock' => 50,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $hardware->id,
            'name' => 'Pardia USB Hub Ultra',
            'slug' => 'pardia-usb-hub-ultra',
            'description' => 'Premium 7-port USB-C hub with 4K HDMI output, SD card reader, Gigabit Ethernet, and 100W power delivery. Machined aluminum body with thermal management system. Compatible with all major operating systems.',
            'short_description' => 'Premium 7-port USB-C hub with 4K HDMI.',
            'price' => 89.99,
            'is_free' => false,
            'type' => 'hardware',
            'thumbnail' => '/images/products/usb-hub.jpg',
            'images' => ['/images/products/usb-hub-1.jpg', '/images/products/usb-hub-2.jpg'],
            'features' => ['7 USB Ports', '4K HDMI', 'SD Card Reader', 'Gigabit Ethernet', '100W PD', 'Aluminum Body'],
            'stock' => 100,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $software->id,
            'name' => 'Pardia Battery Management',
            'slug' => 'pardia-battery-management',
            'description' => 'Keep your Mac battery healthy for years to come. Pardia Battery Management (PBM) helps Apple Silicon Mac users reduce unnecessary charge cycles and extend battery lifespan. The app runs quietly in the background, monitoring your battery health, cycle count, and charging patterns. It provides smart insights on when to plug in or unplug, helping you maintain optimal charging habits that keep your cycle count low. Designed exclusively for Apple Silicon Macs (M1, M2, M3, M4), PBM is lightweight, free, and built to protect your most important component.',
            'short_description' => 'Extend your Mac battery life by keeping charge cycles low.',
            'price' => 0,
            'is_free' => true,
            'type' => 'software',
            'download_url' => '/downloads/PBM-1.0.0.dmg',
            'version' => '1.0.0',
            'thumbnail' => '/images/products/pbm-screenshot.png',
            'images' => ['/images/products/pbm-screenshot.png'],
            'features' => ['Cycle Count Reduction', 'Smart Charging Insights', 'Battery Health Monitoring', 'Apple Silicon Optimized', 'Lightweight & Free', 'Weekly Health Reports'],
            'system_requirements' => ['OS' => 'macOS 13 Ventura or later', 'Chip' => 'Apple Silicon (M1, M2, M3, M4)', 'Storage' => '50 MB'],
            'stock' => 999,
            'is_active' => true,
            'is_featured' => true,
        ]);

        Product::create([
            'category_id' => $utilities->id,
            'name' => 'Pardia Terminal',
            'slug' => 'pardia-terminal',
            'description' => 'A modern terminal emulator with GPU-accelerated rendering, split panes, extensive theming support, and built-in SSH client. Lightweight yet feature-rich, perfect for developers who live in the terminal.',
            'short_description' => 'Free GPU-accelerated modern terminal emulator.',
            'price' => 0,
            'is_free' => true,
            'type' => 'software',
            'download_url' => '#',
            'version' => '1.0.0',
            'thumbnail' => '/images/products/terminal.jpg',
            'images' => ['/images/products/terminal-1.jpg'],
            'features' => ['GPU Rendering', 'Split Panes', 'Themes', 'SSH Client', 'Unicode Support', 'Scriptable'],
            'stock' => 999,
            'is_active' => true,
            'is_featured' => true,
        ]);
    }
}
