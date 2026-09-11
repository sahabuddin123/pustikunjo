#!/usr/bin/env bash

# ==============================================================================
# Pusti Kunjo (পুষ্টি কুঞ্জ) - Production Auto-Deployment & Setup Script
# ==============================================================================
# Usage on live server:
#   git clone https://github.com/sahabuddin123/pustikunjo.git
#   cd pustikunjo
#   chmod +x deploy.sh
#   ./deploy.sh
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "===================================================================="
echo "    🌿 Pusti Kunjo (পুষ্টি কুঞ্জ) - Live Server Auto Deployer      "
echo "===================================================================="
echo -e "${NC}"

# 1. Dependency checks
echo -e "${BLUE}🔍 [1/8] সার্ভার ডিপেনডেন্সি ও প্রয়োজনীয় সফটওয়্যার যাচাই করা হচ্ছে...${NC}"

if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP পাওয়া যায়নি! অনুগ্রহ করে PHP 8.2 বা তার পরবর্তী ভার্সন ইন্সটল করুন।${NC}"
    exit 1
fi
PHP_VERSION=$(php -r 'echo PHP_VERSION;')
echo -e "   ✓ PHP Version: ${GREEN}${PHP_VERSION}${NC}"

if ! command -v composer &> /dev/null; then
    echo -e "${RED}❌ Composer পাওয়া যায়নি! অনুগ্রহ করে Composer ইন্সটল করুন।${NC}"
    exit 1
fi
echo -e "   ✓ Composer: ${GREEN}ইনস্টল করা আছে${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ Node.js পাওয়া যায়নি। বিল্ট ফ্রন্টএন্ড অ্যাসেট দিয়ে কাজ চলবে।${NC}"
    HAS_NODE=false
else
    NODE_VERSION=$(node -v)
    echo -e "   ✓ Node.js Version: ${GREEN}${NODE_VERSION}${NC}"
    HAS_NODE=true
fi

# 2. Environment Configuration (.env)
echo -e "\n${BLUE}⚙️  [2/8] এনভায়রনমেন্ট (.env) ফাইল কনফিগারেশন...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}   .env ফাইল পাওয়া যায়নি, .env.example থেকে তৈরি করা হচ্ছে...${NC}"
    cp .env.example .env
    echo -e "${GREEN}   ✓ .env সফলভাবে তৈরি হয়েছে।${NC}"
else
    echo -e "${GREEN}   ✓ .env ফাইল বিদ্যমান রয়েছে।${NC}"
fi

# 3. SQLite Database File Check
echo -e "\n${BLUE}🗄️  [3/8] ডাটাবেস প্রস্তুত করা হচ্ছে...${NC}"
mkdir -p database
if [ ! -f database/database.sqlite ]; then
    echo -e "${YELLOW}   database/database.sqlite তৈরি করা হচ্ছে...${NC}"
    touch database/database.sqlite
    echo -e "${GREEN}   ✓ SQLite ডাটাবেস তৈরি হয়েছে।${NC}"
else
    echo -e "${GREEN}   ✓ SQLite ডাটাবেস ফাইল বিদ্যমান।${NC}"
fi

# 4. Handle Conflicting PHP Extensions (e.g. Swow / Swoole bug in CLI)
echo -e "\n${BLUE}📦 [4/8] Composer প্রডাকশন ডিপেনডেন্সি ইন্সটল ও অপ্টিমাইজেশন...${NC}"

# Check and disable swow extension if present (swow-v1.4.1 has a known core-dump bug in composer)
if php -m 2>/dev/null | grep -qi "swow"; then
    echo -e "${YELLOW}   ⚠️ PHP 'swow' এক্সটেনশন পাওয়া গেছে (এটি Composer কে ক্র্যাশ করায়)।${NC}"
    echo -e "${YELLOW}   স্বয়ংক্রিয়ভাবে swow নিষ্ক্রিয় করার চেষ্টা চলছে...${NC}"

    # Search and disable swow ini files in common directories
    for dir in /etc/php /www/server/php; do
        if [ -d "$dir" ]; then
            find "$dir" -type f -name "*swow*.ini" 2>/dev/null | while read -r inifile; do
                if [ -f "$inifile" ]; then
                    mv "$inifile" "${inifile}.disabled" 2>/dev/null || true
                    echo -e "${GREEN}   ✓ নিষ্ক্রিয় করা হয়েছে: $inifile${NC}"
                fi
            done
        fi
    done

    # Check loaded php.ini and comment out swow
    for inipath in $(php --ini 2>/dev/null | grep -oE '/[^ ]+\.ini'); do
        if [ -f "$inipath" ] && grep -qiE '^[ ]*extension[ ]*=[ ]*.*swow' "$inipath"; then
            sed -i -E 's/^([ ]*extension[ ]*=[ ]*.*swow.*)/;\1/gi' "$inipath" 2>/dev/null || true
            echo -e "${GREEN}   ✓ swow কমেন্ট করা হয়েছে: $inipath${NC}"
        fi
    done
fi

# Run Composer Install with memory limit
echo -e "   প্যাকেজসমূহ ডাউনলোড ও অপ্টিমাইজ হচ্ছে..."
COMPOSER_BIN=$(command -v composer || echo "composer")
php -d memory_limit=2G "$COMPOSER_BIN" install --no-dev --prefer-dist --optimize-autoloader --no-interaction
echo -e "${GREEN}   ✓ Composer প্যাকেজ সফলভাবে ইন্সটল হয়েছে।${NC}"

# 5. Application Key Generation
echo -e "\n${BLUE}🔑 [5/8] Application Encryption Key যাচাই...${NC}"
APP_KEY_VAL=$(grep -E "^APP_KEY=" .env | cut -d '=' -f2)
if [ -z "$APP_KEY_VAL" ] || [ "$APP_KEY_VAL" = "" ]; then
    echo -e "${YELLOW}   নতুন APP_KEY তৈরি করা হচ্ছে...${NC}"
    php artisan key:generate --force
    echo -e "${GREEN}   ✓ APP_KEY তৈরি হয়েছে।${NC}"
else
    echo -e "${GREEN}   ✓ APP_KEY ইতিমধ্যে সেট করা আছে।${NC}"
fi

# 6. Frontend Assets Build (NPM)
echo -e "\n${BLUE}🎨 [6/8] ফ্রন্টএন্ড অ্যাসেট কম্পাইল করা হচ্ছে (Vite / React)...${NC}"
if [ "$HAS_NODE" = true ]; then
    if command -v npm &> /dev/null; then
        echo -e "   NPM ডিপেনডেন্সি ইন্সটল ও বিল্ড চলছে..."
        npm install --no-audit --no-fund --silent
        npm run build --silent
        echo -e "${GREEN}   ✓ ফ্রন্টএন্ড অ্যাসেট সফলভাবে বিল্ড হয়েছে!${NC}"
    fi
else
    echo -e "${YELLOW}   Node.js নেই, পূর্বের বিল্ড করা public/build অ্যাসেট ব্যবহৃত হবে।${NC}"
fi

# 7. Database Migration & Seed
echo -e "\n${BLUE}🔄 [7/8] ডাটাবেস মাইগ্রেশন ও ডিফল্ট ডাটা সিডিং...${NC}"
php artisan migrate --force

# Seed if users table is empty or first setup
USERS_COUNT=$(php -r "require 'vendor/autoload.php'; \$app = require_once 'bootstrap/app.php'; \$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap(); echo \App\Models\User::count();" 2>/dev/null || echo "0")

if [ "$USERS_COUNT" = "0" ]; then
    echo -e "${YELLOW}   প্রথমবারের মতো ডাটাবেস সিড করা হচ্ছে (পণ্য, ক্যাটাগরি, এডমিন ইউজার, পেজ)...${NC}"
    php artisan db:seed --force
    echo -e "${GREEN}   ✓ ডাটাবেস সিডিং সম্পন্ন হয়েছে!${NC}"
else
    echo -e "${GREEN}   ✓ ডাটাবেস ইতিমধ্যে সিড করা আছে (মোট ইউজার: ${USERS_COUNT})।${NC}"
    echo -e "${BLUE}   ৩টি প্রডাক্ট ও স্লাইডার ব্যানার নিশ্চিত করা হচ্ছে...${NC}"
    php artisan db:seed --class=UpdateThreeProductsSeeder --force
    echo -e "${GREEN}   ✓ ৩টি প্রডাক্ট ও স্লাইডার ব্যানার সিঙ্ক সম্পন্ন।${NC}"
fi

# 8. Storage Link, Caching & Permissions
echo -e "\n${BLUE}⚡ [8/8] স্টোরেজ লিঙ্ক, ক্যাশিং অপ্টিমাইজেশন ও পারমিশন সেট...${NC}"

# Storage Link
php artisan storage:link --force 2>/dev/null || true
echo -e "   ✓ Storage লিঙ্ক তৈরি হয়েছে।"

# Clear & Cache Configurations
php artisan optimize:clear --quiet
php artisan config:cache --quiet
php artisan route:cache --quiet
php artisan view:cache --quiet
php artisan event:cache --quiet
echo -e "   ✓ রুট, ভিউ ও কনফিগ প্রডাকশন ক্যাশে রূপান্তর সম্পন্ন।"

# Set Proper Permissions (Support for aaPanel www, Ubuntu www-data, Nginx, Apache)
echo -e "   ফাইল ও ফোল্ডার পারমিশন ঠিক করা হচ্ছে..."
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache public/uploads public/images/banners public/images/products
chmod -R 777 storage bootstrap/cache database public/uploads public/images 2>/dev/null || true
chmod 666 database/database.sqlite 2>/dev/null || true

# If running as root or with sudo, set web server ownership
if [ "$(id -u)" -eq 0 ]; then
    WEB_USER="www-data"
    if id "www" &>/dev/null; then
        WEB_USER="www"
    elif id "nginx" &>/dev/null; then
        WEB_USER="nginx"
    elif id "apache" &>/dev/null; then
        WEB_USER="apache"
    fi
    chown -R ${WEB_USER}:${WEB_USER} storage bootstrap/cache database public/uploads public/images 2>/dev/null || true
    echo -e "   ✓ ওনারশিপ ${WEB_USER}-এ সেট করা হয়েছে।"
fi

echo -e "\n${GREEN}${BOLD}===================================================================="
echo "    🎉 Pusti Kunjo (পুষ্টি কুঞ্জ) সফলভাবে ডিপ্লয় সম্পন্ন হয়েছে!   "
echo "====================================================================${NC}"
echo -e "🌐 ওয়েবসাইট ভিজিট করুন: ${BOLD}http://your-server-domain-or-ip${NC}"
echo -e "🔐 এডমিন প্যানেল URL:   ${BOLD}http://your-server-domain-or-ip/admin/login${NC}"
echo -e "👤 এডমিন ইমেইল:        ${BOLD}admin@pustikunjo.com.bd${NC}"
echo -e "🔑 এডমিন পাসওয়ার্ড:    ${BOLD}password${NC}"
echo -e "====================================================================\n"
