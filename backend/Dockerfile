# FROM php:8.2-cli

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     git \
#     curl \
#     libpng-dev \
#     libonig-dev \
#     libxml2-dev \
#     zip \
#     unzip \
#     sqlite3 \
#     libsqlite3-dev

# # Clear cache
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# # Install PHP extensions
# RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath

# # Get latest Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # Set working directory
# WORKDIR /app

# # Copy application files
# COPY . /app

# # Install dependencies
# RUN composer install --no-dev --optimize-autoloader --no-interaction

# # Don't copy .env - rely on Render environment variables
# # Create a minimal .env with just APP_KEY placeholder
# RUN echo "APP_KEY=" > .env

# # Create SQLite database directory and file
# RUN mkdir -p /app/database && \
#     touch /app/database/database.sqlite && \
#     mkdir -p /app/storage/framework/cache/data && \
#     mkdir -p /app/storage/framework/sessions && \
#     mkdir -p /app/storage/framework/views && \
#     mkdir -p /app/storage/logs && \
#     chmod -R 777 /app/database && \
#     chmod -R 777 /app/storage && \
#     chmod -R 777 /app/bootstrap/cache

# # Expose port
# EXPOSE 8080

# # Start application (run migrations, then serve)
# # APP_KEY must be set as environment variable in Render
# CMD php artisan migrate --force && \
#     php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite mbstring bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Copy Nginx & Supervisor configs
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 10000

CMD ["/usr/bin/supervisord"]
