// setup.mjs - Generic Project Setup Template (v2 - Improved)
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// =============================================================================
// == CONFIGURATION SECTION ==
// =============================================================================
// Modify these values for your specific project needs.

const config = {
    // --- Project Settings ---
    projectName: 'local-hub-nextjs', // Defaults to current directory name
    projectVersion: '0.1.0',
    projectDescription: 'Local Hub - Your City Marketplace, built with Next.js and TypeScript',
    projectAuthor: '',
    projectLicense: 'MIT',
    projectType: 'module',
    mainEntry: 'src/app/page.tsx', // Next.js App Router entry

    // --- Framework/Tooling Specifics ---
    framework: 'nextjs', // <<< CHANGE THIS FOR YOUR PROJECT TYPE

    // --- Dependencies ---
    dependencies: {
        'next': '^14.1.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@fortawesome/fontawesome-svg-core': '^6.5.1',
        '@fortawesome/free-solid-svg-icons': '^6.5.1',
        '@fortawesome/free-regular-svg-icons': '^6.5.1',
        '@fortawesome/react-fontawesome': '^0.2.0',
        'clsx': '^2.1.0', // Useful for conditional classes
    },
    // Add development dependencies. Leave empty if none initially.
    devDependencies: {
        '@types/node': '^20.11.19',
        '@types/react': '^18.2.55',
        '@types/react-dom': '^18.2.19',
        'typescript': '^5.3.3',
        'autoprefixer': '^10.4.17',
        'postcss': '^8.4.35',
        'tailwindcss': '^3.4.1',
        'eslint': '^8.56.0',
        'eslint-config-next': '^14.1.0',
    },

    // --- NPM Scripts ---
    scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        test: 'echo "Error: no test script specified" && exit 1',
    },

    // --- API Keys / Environment Placeholders ---
    envPlaceholders: {
        PORT: '3000',
        // NEXT_PUBLIC_API_URL: 'http://localhost:3001/api' // Example for client-side env var
    },

    // --- File Paths (Core structure) ---
    projectDir: process.cwd(),
    srcDir: path.join(process.cwd(), 'src'),
    appDir: path.join(process.cwd(), 'src', 'app'),
    componentsDir: path.join(process.cwd(), 'src', 'components'),
    dataDir: path.join(process.cwd(), 'src', 'data'),
    hooksDir: path.join(process.cwd(), 'src', 'hooks'),
    typesDir: path.join(process.cwd(), 'src', 'types'),
    publicDir: path.join(process.cwd(), 'public'),

    // --- Optional Cleanup ---
    cleanupTargets: [
        'src/app/favicon.ico', // Next.js default
        'src/app/page.module.css', // Next.js default
        'public/next.svg',
        'public/vercel.svg',
    ],
};

// =============================================================================
// == HELPER FUNCTIONS ==
// =============================================================================
// (Generally reusable - no need to modify often)

function log(message) {
  console.log(`[SETUP] ${message}`);
}

function runCommand(command, ignoreErrors = false) {
  try {
    log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[ERROR] Failed to execute: ${command}`);
    console.error(error.message);
    if (!ignoreErrors) {
        process.exit(1);
    } else {
        log(`[WARN] Command failed but execution continues (ignoreErrors=true).`)
    }
  }
}

function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created directory: ${path.relative(config.projectDir, dir) || '.'}`);
    }
    fs.writeFileSync(filePath, content.trimStart().replace(/\n\s+$/, '\n')); // Trim start, ensure single trailing newline
    log(`Created/Overwritten: ${path.relative(config.projectDir, filePath)}`);
  } catch (error) {
    console.error(`[ERROR] Failed to write file: ${filePath}`, error);
    process.exit(1);
  }
}

function deleteFileOrDir(targetPath) {
    const fullPath = path.resolve(config.projectDir, targetPath); // Ensure path is absolute
    if (fs.existsSync(fullPath)) {
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            log(`Deleted: ${targetPath}`);
        } catch (error) {
            console.error(`[WARN] Failed to delete: ${targetPath} - ${error.message}`);
        }
    } else {
         log(`Skipped delete (not found): ${targetPath}`);
    }
}

// =============================================================================
// == FILE CONTENT DEFINITIONS ==
// =============================================================================

// --- Standard Config Files ---

function getGitignoreContent() {
    return `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo
tsconfig.tsbuildinfo

# Optional npm cache
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env*.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# VS Code files
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# JetBrains IDEs config folder
.idea

# Vim swap files
.*.sw?

# macOS Finder files
.DS_Store

# Build output
dist
dist-*
build/
out/
public/build # Remix build output

# Next.js build output
.next/
out/

# Nuxt.js build output
.nuxt/
.output/

# Gatsby files
.cache/
public

# SvelteKit files
.svelte-kit/

# Vite build output
dist/
dist-ssr/
    `;
}

function getEnvExampleContent() {
    let content = `# Environment variables for ${config.projectName}\n`;
    content += `# Rename this file to .env.local for local development overrides.\n`;
    content += `# DO NOT COMMIT YOUR ACTUAL .env* FILES (except .env.example) TO VERSION CONTROL!\n\n`;
    if (Object.keys(config.envPlaceholders).length === 0) {
        content += `# No environment variables defined in setup.mjs config.\n`;
    } else {
        for (const key in config.envPlaceholders) {
            const comment = key.startsWith('NEXT_PUBLIC_') ? ' # Note: NEXT_PUBLIC_ prefix exposes this to the browser' : '';
            content += `${key}=${config.envPlaceholders[key]}${comment}\n`;
        }
    }
    return content;
}

function getReadmeContent() {
    return `
# ${config.projectName}

${config.projectDescription}

This project is a Next.js application scaffolded with a custom setup script.

## Getting Started

First, install dependencies:
\`\`\`bash
npm install
# or
# yarn install
# or
# pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
# yarn dev
# or
# pnpm dev
\`\`\`

Open [http://localhost:${config.envPlaceholders.PORT || 3000}](http://localhost:${config.envPlaceholders.PORT || 3000}) with your browser to see the result.

You can start editing the page by modifying \`src/app/page.tsx\`. The page auto-updates as you edit the file.

## Key Files and Folders

*   \`src/app/\`: Contains the core application routes (App Router).
    *   \`layout.tsx\`: The main layout component.
    *   \`page.tsx\`: The home page component.
    *   \`globals.css\`: Global stylesheets.
*   \`src/components/\`: Reusable React components.
*   \`src/data/\`: Static data, mock data, or data fetching utilities.
*   \`src/hooks/\`: Custom React hooks.
*   \`src/types/\`: TypeScript type definitions.
*   \`public/\`: Static assets like images, fonts (not handled by Webpack/Next.js build).
*   \`next.config.mjs\`: Next.js configuration file.
*   \`tailwind.config.ts\`: Tailwind CSS configuration.
*   \`postcss.config.js\`: PostCSS configuration (for Tailwind).
*   \`tsconfig.json\`: TypeScript configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

*   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
`;
}

// --- Framework-Specific Config Files ---

function getNextConfigContent() {
    const isModule = config.projectType === 'module';
    const nextConfigFilename = isModule ? 'next.config.mjs' : 'next.config.js';

    const content = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add other Next.js config options here
  // For example, to allow images from external domains:
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'images.unsplash.com',
  //       // port: '', // Optional
  //       // pathname: '/account123/**', // Optional
  //     },
  //   ],
  // },
  // experimental: {
  //   typedRoutes: true, // If you want typed routes
  // },
};

${isModule ? 'export default nextConfig;' : 'module.exports = nextConfig;'}
`;
    return { filename: nextConfigFilename, content };
}

function getTsConfigContent() {
    return `
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "setup.mjs"],
  "exclude": ["node_modules"]
}
`;
}

function getTailwindConfigContent() {
    return `
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // For compatibility if pages dir is used
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Add custom colors from the HTML if needed, e.g.
        // 'brand-blue': '#3b82f6',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Uncomment if you use form styling plugin
  ],
};
export default config;
`;
}

function getPostcssConfigContent() {
    return `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}


// --- Core Application Files (Next.js App Router) ---

function getGlobalsCssContent() {
    // Base CSS Reset and Defaults from template + custom styles from HTML
    return `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles from HTML */
body {
    font-family: 'Inter', sans-serif;
}

/* Стили для модального окна товара */
.product-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
    display: none; /* Controlled by React state */
    overscroll-behavior: contain;
}

/* Класс для блокировки скролла body и компенсации ширины скроллбара */
.no-scroll {
    overflow: hidden;
    padding-right: var(--scrollbar-width, 0px);
}
.product-modal.active { /* This class will be managed by React state now */
    display: block;
}
.modal-close {
    position: fixed; /* Consider moving to component style or making relative to modal */
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    color: white;
    font-size: 20px;
    cursor: pointer;
}
.modal-content {
    padding: 20px;
    padding-top: 60px; /* Space for close button if it's inside */
    max-height: calc(100vh - 0px); /* Adjust if header/footer are outside modal scroll */
    overflow-y: auto;
}
.modal-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
}
.active-tab { /* Handled by component logic now for NavigationBar */
    /* color: #3b82f6; */ /* Tailwind: text-blue-600 */
    /* transform: scale(1.1); */ /* Tailwind: scale-110 */
}
.tab-icon {
    transition: transform 0.2s ease-in-out;
}
.item-card { /* Consider making this a @layer component in Tailwind */
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06);
    border: 1px solid #e5e7eb; /* Tailwind: border border-gray-200 */
}
.item-card:hover {
    transform: translateY(-4px); /* Tailwind: hover:-translate-y-1 */
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); /* Tailwind: hover:shadow-lg */
}
.category-chip {
    transition: all 0.2s ease;
    border: 1px solid transparent;
}
.category-chip.active {
    background-color: #eff6ff; /* Tailwind: bg-blue-50 */
    color: #2563eb; /* Tailwind: text-blue-700 */
    border-color: #93c5fd; /* Tailwind: border-blue-300 */
    font-weight: 500;
}
.search-input {
    transition: all 0.3s ease;
}
.search-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); /* Tailwind: focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 */
    background-color: white;
}
.skeleton {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
}
.badge { /* Consider making this a component */
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    font-size: 10px; /* Tailwind: text-xs */
    padding: 0 4px;
}
.provider-card {
    transition: background-color 0.2s ease;
}
.provider-card:hover {
    background-color: #f9fafb; /* Tailwind: hover:bg-gray-50 */
}
.gradient-banner {
    background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
}
.tab-content { display: none; animation: fadeIn 0.4s ease-out; } /* Handled by React conditional rendering */
.tab-content.active { display: block; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes head-shake {
  0% { transform: translateX(0); }
  12.5% { transform: translateX(-6px) rotateY(-5deg); }
  37.5% { transform: translateX(5px) rotateY(4deg); }
  62.5% { transform: translateX(-3px) rotateY(-2deg); }
  87.5% { transform: translateX(2px) rotateY(1deg); }
  100% { transform: translateX(0); }
}
.animate-head-shake { /* Can be applied with Tailwind or clsx */
    animation: head-shake 0.7s ease-in-out;
}

/* Скрыть скроллбар для контейнеров с горизонтальной прокруткой */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Компенсация сдвига для fixed/sticky элементов при скрытии скроллбара */
body.no-scroll nav,
body.no-scroll header {
     padding-right: var(--scrollbar-width, 0px);
}

/* Base CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  /* margin: 0; */ /* Handled by Tailwind base */
  /* padding: 0; */ /* Handled by Tailwind base */
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  /* font-family set by Inter font in layout */
}

body {
  min-height: 100vh;
  line-height: inherit;
  /* background-color: #f8f9fa; */ /* Tailwind bg-gray-100 set in layout */
  /* color: #212529; */ /* Tailwind text-gray-800 or similar */
}

img, picture, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

#root, #__next { /* Common root IDs */
  isolation: isolate;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
   scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}

function getRootLayoutContent() {
    return `
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tailwind and custom global styles
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import AppStateProvider from '@/context/AppStateProvider'; // To be created for managing global state

// Prevent Font Awesome from adding its CSS since we did it manually
fontAwesomeConfig.autoAddCss = false;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: '${config.projectName}',
  description: '${config.projectDescription}',
  // viewport: 'width=device-width, initial-scale=1.0', // Next.js handles this by default
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-gray-100 font-sans"> {/* Use inter variable for font */}
        <AppStateProvider>
          <div className="max-w-lg mx-auto bg-white min-h-screen flex flex-col shadow-lg">
            {children}
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
`;
}

function getHomePageContent() {
    return `
"use client";

import React, { useContext } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import CategoryItemsView from '@/components/CategoryItemsView';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import ProductModal from '@/components/ProductModal';
import SearchOverlay from '@/components/SearchOverlay';
import SearchResultsContainer from '@/components/SearchResultsContainer';
import { AppStateContext } from '@/context/AppStateProvider'; // To be created
import { itemsData } from '@/data/items'; // Example data import

export default function HomePage() {
  const {
    activeTab,
    setActiveTab,
    isProductModalOpen,
    selectedProduct,
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    isSearchResultsOpen,
    searchQuery,
    openProductModal,
    closeProductModal,
    openCategoryItemsView,
    closeCategoryItemsView,
    openSearchOverlay,
    closeSearchOverlay,
    openSearchResults,
    closeSearchResults,
    setSearchQuery,
    setSearchStatusText,
  } = useContext(AppStateContext);

  const handleSearch = (query: string) => {
    if (!query) {
      // Add some visual feedback for empty search if desired
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query);
    openSearchOverlay();
    // Simulate search steps (logic moved to AppStateProvider or a hook)
    let step = 0;
    const searchSteps = [
        { text: "Проверяю наличие у ближайших продавцов...", delay: 1200 },
        { text: "Ищу похожие товары и услуги в вашем городе...", delay: 1500 },
        { text: "Подбираю лучшие варианты для вас...", delay: 1300 }
    ];
    function nextStep() {
        if (step < searchSteps.length) {
            setSearchStatusText(searchSteps[step].text);
            setTimeout(nextStep, searchSteps[step].delay);
            step++;
        } else {
            closeSearchOverlay();
            openSearchResults(query); // Pass query to results
        }
    }
    setSearchStatusText('Анализирую ваш запрос: "' + query + '"...');
    setTimeout(nextStep, 1000);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab items={itemsData} onProductClick={openProductModal} onCategoryLinkClick={openCategoryItemsView} />;
      case 'categories':
        return <CategoriesTab onCategoryClick={openCategoryItemsView} />;
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab items={itemsData} onProductClick={openProductModal} onCategoryLinkClick={openCategoryItemsView} />;
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto pb-20"> {/* pb-20 for nav bar */}
        {renderTabContent()}
      </main>
      <NavigationBar />

      {isProductModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={closeProductModal}
        />
      )}

      {isCategoryViewOpen && categoryForView && (
        <CategoryItemsView
          categoryName={categoryForView}
          items={itemsData.filter(item => item.category === categoryForView)}
          onClose={closeCategoryItemsView}
          onProductClick={openProductModal}
        />
      )}

      {isSearchOverlayOpen && (
        <SearchOverlay isOpen={isSearchOverlayOpen} statusText={searchStatusText} />
      )}

      {isSearchResultsOpen && (
        <SearchResultsContainer
          isOpen={isSearchResultsOpen}
          onClose={closeSearchResults}
          query={searchQuery}
        />
      )}
    </>
  );
}
`;
}

// --- Component Files ---
function getHeaderComponentContent() {
    return `
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faBell } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider'; // Assuming context exists
import { useContext } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { notificationsCount, favoritesCount } = useContext(AppStateContext); // Example from context

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <header className="bg-white py-3 px-4 sticky top-0 z-30 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Image src="/ikeber.svg" alt="Local Hub Logo" width={24} height={24} className="text-blue-600" />
          <button className="flex items-center text-xs text-gray-500 hover:text-blue-600 ml-3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-red-500" />
            <span>Екатеринбург</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-1" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-blue-600 relative">
            <FontAwesomeIcon icon={farHeart} className="text-xl" />
            {favoritesCount > 0 && (
              <span className="badge bg-red-500 text-white rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>
          <button className="text-gray-500 hover:text-blue-600 relative">
            <FontAwesomeIcon icon={farBell} className="text-xl" />
            {notificationsCount > 0 && (
               <span className="badge bg-blue-500 text-white rounded-full flex items-center justify-center">
                {notificationsCount}
               </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Найти товар, услугу или мастера..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full py-2.5 px-4 pl-10 pr-3 bg-gray-100 rounded-l-lg border border-r-0 border-gray-200 focus:border-blue-400 search-input text-sm"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 -ml-px"
        >
          Искать
        </button>
      </div>
    </header>
  );
};

export default Header;
`;
}

function getNavigationBarComponentContent() {
    return `
"use client";
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';
import clsx from 'clsx';

const navItems = [
  { id: 'home', label: 'Главная', icon: faHome },
  { id: 'categories', label: 'Категории', icon: faThLarge },
  { id: 'orders', label: 'Заказы', icon: faReceipt /* badgeCount: 1 */ }, // Example badge
  { id: 'profile', label: 'Профиль', icon: faUserCircle },
];

const NavigationBar: React.FC = () => {
  const { activeTab, setActiveTab, ordersBadgeCount } = useContext(AppStateContext);

  const handleTabChange = (tabId: string) => {
    // Logic to close any open modals/views before switching tabs
    // This should ideally be centralized in AppStateProvider or a custom hook
    // For now, just switch tab
    setActiveTab(tabId);
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-lg py-1.5 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={clsx(
              'tab-button flex-1 flex flex-col items-center px-3 py-1 transition-colors duration-200',
              activeTab === item.id ? 'text-blue-600 scale-105' : 'text-gray-500 hover:text-blue-500'
            )}
            onClick={() => handleTabChange(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} className="tab-icon text-xl" />
            {item.id === 'orders' && ordersBadgeCount > 0 && (
                 <span className="badge bg-orange-500 text-white rounded-full flex items-center justify-center" style={{top: '-4px', right: 'calc(50% - 22px)'}}>
                    {ordersBadgeCount}
                 </span>
            )}
            <span className={clsx("text-xs mt-0.5", activeTab === item.id && "font-medium")}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
`;
}

function getProductModalComponentContent() {
    return `
"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items'; // Assuming Item type is in data/items.ts

interface ProductModalProps {
  product: Item;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="product-modal active" // 'active' class makes it visible via CSS
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalProductTitle"
    >
      <button className="modal-close" onClick={onClose} aria-label="Закрыть модальное окно">
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="modal-content scrollbar-hide">
        <Image
          id="modalProductImage"
          src={product.image}
          alt={product.name}
          width={400} // Provide appropriate width/height or use fill with a sized container
          height={300}
          className="modal-image"
          priority // If it's LCP when modal opens
        />
        <h2 id="modalProductTitle" className="text-xl font-bold mb-2">{product.name}</h2>
        <p id="modalProductProvider" className="text-gray-500 text-sm mb-4">{product.provider}</p>
        <p id="modalProductPrice" className="text-blue-600 font-bold text-lg mb-4">{product.price}</p>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
          Добавить в корзину
        </button>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Описание</h3>
          <div className="pr-2"> {/* For potential scrollbar space, if content overflows description box */}
            <p id="modalProductDescription" className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
`;
}

function getProductCardComponentContent() {
    return `
"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items'; // Assuming Item type

interface ProductCardProps {
  item: Item;
  onClick?: (item: Item) => void; // For opening modal
  onAddToCart?: (item: Item) => void; // For adding to cart
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onClick, onAddToCart, className }) => {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click if target is the add to cart button
    if ((e.target as HTMLElement).closest('button.add-to-cart-btn')) {
      return;
    }
    if (onClick) {
      onClick(item);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click event
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      console.log('Add to cart:', item.name);
    }
  };

  return (
    <div
      className={\`item-card bg-white rounded-lg overflow-hidden \${onClick ? 'cursor-pointer' : ''} \${className}\`}
      onClick={onClick ? handleCardClick : undefined}
      data-item-id={item.id}
    >
      <div className="relative w-full h-32"> {/* Container for Image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 200px" // Adjust sizes
          style={{ objectFit: 'cover' }}
          className="transform group-hover:scale-105 transition-transform duration-300" // Example hover effect
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 truncate" title={item.name}>{item.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate" title={item.provider}>{item.provider}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-blue-600">{item.price}</span>
          <button
            className="add-to-cart-btn text-blue-500 hover:text-blue-700 p-1"
            onClick={handleAddToCartClick}
            aria-label={\`Добавить \${item.name} в корзину\`}
          >
            <FontAwesomeIcon icon={faCartPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
`;
}


function getHomeTabComponentContent() {
    return `
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Or use AppStateContext to switch tabs/views
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCouch, faTools, faPalette, faLaptop, faTags, faStar, faChevronRight, faCartPlus
} from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items';
import ProductCard from '@/components/ProductCard'; // Reusable ProductCard

interface HomeTabProps {
  items: Item[];
  onProductClick: (item: Item) => void;
  onCategoryLinkClick: (categoryName: string) => void; // For "Что ищем сегодня?"
}

// Sample data for sections - in a real app, this would come from props or API
const quickCategories = [
  { name: "Для дома", icon: faCouch, color: "blue", categoryId: "Товары для дома" },
  { name: "Услуги", icon: faTools, color: "green", categoryId: "Ремонт и услуги" },
  { name: "Хендмейд", icon: faPalette, color: "purple", categoryId: "Хендмейд и творчество" },
  { name: "Электроника", icon: faLaptop, color: "yellow", categoryId: "Электроника" },
];

const promotions = [
  { id: 'promo1', title: "Обед со скидкой", provider: 'Кафе "Вкусняшка"', image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60", discount: "20%", expiry: "до 31 мая" },
  { id: 'promo2', title: "Гаджет недели", provider: 'Магазин "ТехноМир"', image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60", discount: "15%", expiry: "до 25 мая" },
];

const recommendedItemsPlaceholders = [ // Replace with actual item IDs or full item objects if needed
    itemsData.find(i => i.id === 1),
    itemsData.find(i => i.category === "Ремонт и услуги"), // Example: find a service
    itemsData.find(i => i.id === 4),
    itemsData.find(i => i.id === 8),
].filter(Boolean) as Item[]; // Filter out undefined if not found

const nearbyProviders = [
    { id: 'prov1', name: 'Магазин "Уютный Дом"', type: "Товары для дома", rating: 4.8, delivery: "Доставка от 99 ₽ • ~ 1.5 км", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60" },
    { id: 'prov2', name: 'Сергей П. - Электрик', type: "Ремонтные услуги", rating: 5.0, delivery: "Выезд на дом • ~ 2 км", image: "https://images.unsplash.com/photo-1581091226809-5003d1eh3e7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlcGFpcm1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60" },
    { id: 'prov3', name: 'Студия "ГлинаАрт"', type: "Хендмейд, Мастер-классы", rating: 4.9, delivery: "Доставка от 149 ₽ • ~ 0.8 км", image: "https://images.unsplash.com/photo-1576495199011-b61cdc8dde5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvdHRlcnl8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=100&q=60" },
];


const HomeTab: React.FC<HomeTabProps> = ({ items, onProductClick, onCategoryLinkClick }) => {
  return (
    <div id="home-tab" className="tab-content active"> {/* 'active' class can be removed if parent controls visibility */}
      {/* Промо-баннер */}
      <div className="m-4 rounded-lg overflow-hidden gradient-banner text-white p-5">
        <h2 className="text-lg font-semibold">Доставка по городу - Быстро и Выгодно!</h2>
        <p className="text-sm mt-1 opacity-90">Выберите удобный тариф при оформлении заказа.</p>
        {/* This link should ideally use context/router to switch tab and scroll */}
        <a href="#delivery-info" onClick={(e) => { e.preventDefault(); /* switchTab('profile'); setTimeout(() => document.getElementById('delivery-info')?.scrollIntoView(), 100); */ console.log("Navigate to delivery info in profile tab");}}
           className="mt-3 inline-block bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition">
          Тарифы доставки
        </a>
      </div>

      {/* Быстрые категории */}
      <div className="px-4 pt-2 pb-4">
        <h3 className="text-base font-semibold mb-3 text-gray-700">Что ищем сегодня?</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          {quickCategories.map(cat => (
            <button key={cat.name} onClick={() => onCategoryLinkClick(cat.categoryId)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300">
              <div className={\`w-12 h-12 bg-\${cat.color}-100 rounded-full flex items-center justify-center mb-1.5\`}>
                <FontAwesomeIcon icon={cat.icon} className={\`text-\${cat.color}-600 text-lg\`} />
              </div>
              <span className="text-xs text-gray-600 font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Акции и скидки */}
      <div className="px-4 py-4 bg-amber-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-amber-700">Акции и скидки <FontAwesomeIcon icon={faTags} className="ml-1 text-amber-600" /></h2>
          <button className="text-amber-600 text-sm font-medium hover:text-amber-800">Все акции →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {promotions.map(promo => (
            <div key={promo.id} className="item-card bg-white rounded-lg overflow-hidden border border-amber-300 relative cursor-pointer" onClick={() => console.log("Open promo:", promo.title)}>
              <Image src={promo.image} alt={promo.title} width={200} height={112} className="w-full h-28 object-cover" />
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-md font-semibold absolute top-2 left-2">-{promo.discount}</span>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 truncate mt-1">{promo.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{promo.provider}</p>
                <p className="text-xs text-red-600 font-medium mt-1">{promo.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендуемые товары и услуги */}
      <div className="px-4 py-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Рекомендуем вам</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Все →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendedItemsPlaceholders.map((item) => (
            <ProductCard key={item.id} item={item} onClick={onProductClick} />
          ))}
        </div>
      </div>

      {/* Мастера и магазины рядом */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Мастера и магазины рядом</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Все →</button>
        </div>
        <div className="space-y-3">
            {nearbyProviders.map(provider => (
                <div key={provider.id} className="flex items-center bg-white rounded-lg p-3 border border-gray-200 provider-card cursor-pointer">
                    <Image src={provider.image} alt={provider.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover mr-3" />
                    <div className="flex-1">
                        <h3 className="font-medium text-sm text-gray-800">{provider.name}</h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                            <span>{provider.type}</span>
                            <span className="text-yellow-500"><FontAwesomeIcon icon={faStar} className="text-xs" /> {provider.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{provider.delivery}</p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 ml-2" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
`;
}

function getCategoriesTabContent() {
    return `
"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faTools, faPalette, faLaptop, faTshirt, faBookOpen, faHeartbeat, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface CategoriesTabProps {
  onCategoryClick: (categoryName: string) => void;
}

const categories = [
  { name: "Товары для дома", icon: faCouch, color: "blue-600", bgColor: "blue-100" },
  { name: "Ремонт и услуги", icon: faTools, color: "green-600", bgColor: "green-100" },
  { name: "Хендмейд и творчество", icon: faPalette, color: "purple-600", bgColor: "purple-100" },
  { name: "Электроника", icon: faLaptop, color: "yellow-600", bgColor: "yellow-100" },
  { name: "Одежда и аксессуары", icon: faTshirt, color: "red-600", bgColor: "red-100" },
  { name: "Книги и хобби", icon: faBookOpen, color: "indigo-600", bgColor: "indigo-100" },
  { name: "Красота и здоровье", icon: faHeartbeat, color: "pink-600", bgColor: "pink-100" },
];

const CategoriesTab: React.FC<CategoriesTabProps> = ({ onCategoryClick }) => {
  return (
    <div id="categories-tab" className="tab-content p-4"> {/* 'active' class managed by parent */}
      <h1 className="text-xl font-bold text-gray-800 mb-5">Категории</h1>
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryClick(category.name)}
            className="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <div className={\`w-10 h-10 rounded-md bg-\${category.bgColor} flex items-center justify-center mr-4\`}>
              <FontAwesomeIcon icon={category.icon} className={\`text-\${category.color} text-lg\`} />
            </div>
            <span className="font-medium text-gray-700 flex-1">{category.name}</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
`;
}


function getCategoryItemsViewComponentContent() {
    return `
"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items';
import ProductCard from './ProductCard'; // Assuming ProductCard component

interface CategoryItemsViewProps {
  categoryName: string;
  items: Item[];
  onClose: () => void;
  onProductClick: (item: Item) => void;
}

const CategoryItemsView: React.FC<CategoryItemsViewProps> = ({ categoryName, items, onClose, onProductClick }) => {
  // This component is now a modal-like view, not a full tab.
  // Parent (HomePage) controls its visibility via 'isOpen' prop.
  // The 'active' class logic would be managed there.

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transition-opacity duration-300 ease-in-out">
      <div className="max-w-lg mx-auto bg-white flex flex-col shadow-lg h-full">
        <header className="bg-white py-3 px-4 sticky top-0 z-30 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Товары: {categoryName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-2 -mr-2" aria-label="Закрыть просмотр категории">
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </header>
        <main className="flex-1 p-4 overflow-y-auto scrollbar-hide pb-20"> {/* Added pb-20 for potential nav overlap */}
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">В этой категории пока нет товаров.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {items.map(item => (
                <ProductCard key={item.id} item={item} onClick={onProductClick} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryItemsView;
`;
}

function getOrdersTabContent() {
 return `
"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

// Sample order data - replace with actual data fetching
const orders = [
  {
    id: 'LH-10583',
    date: '15 мая 2024',
    status: 'Доставлен',
    statusColor: 'green',
    itemsPreview: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNlcmFtaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&h=60&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&h=60&q=80",
    ],
    additionalItemsCount: 1,
    itemsDescription: 'Ваза ручной работы, Кроссовки "Urban Run", ...',
    total: '7 490 ₽',
  },
  {
    id: 'LH-10579',
    date: '18 мая 2024',
    status: 'В обработке',
    statusColor: 'yellow',
    itemsPreview: [
      "https://images.unsplash.com/photo-1611117775350-ac3c7099e9c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9vbCUyMHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80",
    ],
    additionalItemsCount: 0,
    itemsDescription: 'Услуга: Ремонт бытовой техники',
    total: '500 ₽',
  }
];

const OrdersTab: React.FC = () => {
  if (orders.length === 0) {
    return (
      <div id="orders-tab" className="tab-content p-4 text-center py-12">
        {/* SVG and "Нет заказов" message can be added here if needed */}
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет заказов</h3>
        <p className="mt-1 text-sm text-gray-500">У вас пока нет активных или завершенных заказов.</p>
        <button /* onClick={() => switchTab('home')} */
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Начать покупки
        </button>
      </div>
    );
  }

  return (
    <div id="orders-tab" className="tab-content p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Заказ #{order.id}</span>
                  <p className="text-xs text-gray-500">от {order.date}</p>
                </div>
                <span className={\`text-xs font-medium bg-\${order.statusColor}-100 text-\${order.statusColor}-700 px-2.5 py-1 rounded-full\`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 my-3">
                {order.itemsPreview.map((imgSrc, index) => (
                  <Image key={index} src={imgSrc} alt="Preview" width={48} height={48} className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                ))}
                {order.additionalItemsCount > 0 && (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <span className="text-xs text-gray-500">+{order.additionalItemsCount}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {order.itemsDescription}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
              <span className="text-base font-bold text-gray-900">{order.total}</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Детали заказа <FontAwesomeIcon icon={faAngleRight} className="fa-xs ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;
`;
}

function getProfileTabContent() {
    return `
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faTags, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard, faComments } from '@fortawesome/free-regular-svg-icons';

const profileLinks = [
    { text: "Адреса доставки", icon: faMapMarkedAlt, iconColor: "text-blue-600", href: "#" },
    { text: "Способы оплаты", icon: faCreditCard, iconColor: "text-green-600", href: "#" },
    { text: "Мои промокоды", icon: faTags, iconColor: "text-purple-600", href: "#", badge: "2 новых" },
    { text: "Связаться с поддержкой", icon: faComments, iconColor: "text-yellow-600", href: "#" },
];

const deliveryTariffs = [
    { name: "🚀 СвифтЛокал", description: "Самая быстрая доставка (от 30 до 90 минут).", priceInfo: "от 199 ₽", details: "+ 15 ₽/км после 1 км", color: "text-blue-700" },
    { name: "🚲 ЭкоЛокал", description: "Стандартная доставка (в течение 2-4 часов или на след. день).", priceInfo: "от 99 ₽", details: "+ 10 ₽/км после 2 км", color: "text-green-700" },
    { name: "💰 ХабСэйвер", description: "Бесплатная ЭкоЛокал доставка для заказов от 2000 ₽.", priceInfo: "0 ₽", details: "(при сумме заказа > 2000 ₽)", color: "text-purple-700" },
    { name: "🏃 Самовывоз", description: "Заберите заказ самостоятельно у продавца.", priceInfo: "0 ₽", details: "", color: "text-orange-700" },
];


const ProfileTab: React.FC = () => {
  return (
    <div id="profile-tab" className="tab-content p-4">
      <div className="flex items-center mb-6">
        <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60" alt="Аватар" width={64} height={64} className="w-16 h-16 rounded-full mr-4 border-2 border-blue-200 object-cover" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Алексей Петров</h2>
          <p className="text-sm text-gray-500">+7 (912) 345-67-89</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {profileLinks.map(link => (
          <Link key={link.text} href={link.href}
             className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            <FontAwesomeIcon icon={link.icon} className={\`w-5 text-center \${link.iconColor} mr-3\`} />
            <span className="text-gray-700 flex-1">{link.text}</span>
            {link.badge && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-2">{link.badge}</span>
            )}
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </Link>
        ))}
      </div>

      <div id="delivery-info" className="bg-white p-4 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Наши тарифы доставки</h3>
        <div className="space-y-3 text-sm">
          {deliveryTariffs.map(tariff => (
            <div key={tariff.name} className="border-b pb-2 last:border-b-0 last:pb-0">
              <p className={\`font-medium \${tariff.color}\`}>{tariff.name}</p>
              <p className="text-gray-600 text-xs">{tariff.description}</p>
              <p className="text-gray-800 font-medium mt-1">
                {tariff.priceInfo} {tariff.details && <span className="text-gray-500 font-normal">{tariff.details}</span>}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">*Точная стоимость рассчитывается при оформлении заказа и зависит от расстояния и спроса.</p>
      </div>

      <button className="w-full text-center py-2 text-red-600 hover:text-red-800 text-sm">
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfileTab;
`;
}

function getSearchOverlayComponentContent() {
    return `
"use client";
import React from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  statusText: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, statusText }) => {
  if (!isOpen) return null;

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out opacity-100"
      // Opacity and hidden class controlled by parent via isOpen
    >
      <div id="search-status-text" className="text-white text-xl mb-4 text-center px-4">
        {statusText}
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default SearchOverlay;
`;
}

function getSearchResultsContainerComponentContent() {
    return `
"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserTie, faConciergeBell, faClipboardList, faPaperPlane, faUserClock, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider'; // If needed for global actions
import { useContext } from 'react';

interface SearchResultsContainerProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchResultsContainer: React.FC<SearchResultsContainerProps> = ({ isOpen, onClose, query }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', details: ''});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentFormData = new FormData(event.currentTarget);
    const data = {
        item: query,
        name: currentFormData.get('name') as string,
        contact: currentFormData.get('contact') as string,
        details: currentFormData.get('details') as string,
    };
    console.log("Форма заявки отправлена:", data);
    setFormData({name: data.name, contact: data.contact, details: data.details }); // Store for thank you message
    setFormSubmitted(true);
    // Here, you would typically send 'data' to your backend
  };

  if (!isOpen) return null;

  return (
    <div
      id="search-results-container"
      className="fixed inset-0 bg-white z-50 overflow-y-auto transition-opacity duration-300 ease-in-out opacity-100"
    >
      <div className="max-w-lg mx-auto bg-white min-h-screen flex flex-col shadow-lg">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 id="search-results-header" className="text-xl font-bold text-gray-800">
              {formSubmitted ? "Специалист уже в деле!" : "Нужна помощь в поиске?"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-2 -mr-2" aria-label="Закрыть результаты поиска">
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          </div>
          <div id="search-results-content" className="space-y-4">
            {!formSubmitted ? (
              <div className="text-center py-5 px-4">
                <FontAwesomeIcon icon={faUserTie} className="text-5xl text-blue-500 mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  Автоматический поиск по запросу <strong className="text-blue-600">"{query}"</strong> не дал мгновенных результатов.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Но не отчаивайтесь! Попробуйте наш <strong className="text-green-600">бесплатный сервис персонального подбора</strong> — это займет всего минуту.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left mb-6 shadow-sm">
                  <h3 className="text-md font-semibold text-blue-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faConciergeBell} className="mr-2" />Как это работает?
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Наш специалист вручную изучит ваш запрос. Он проанализирует актуальные предложения от мастеров и магазинов в вашем городе, тщательно сравнит варианты по цене и качеству, а также ознакомится с отзывами. Мы стремимся найти наилучшее решение именно для вас.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />Доверьте поиск профессионалу!
                  </h3>
                  <form id="search-request-form" onSubmit={handleSubmit}>
                    {/* Form inputs as in original HTML, ensure controlled components if needed or use FormData */}
                    <div className="mb-3">
                        <label htmlFor="request_item" className="block text-xs font-medium text-gray-600 mb-1">Что вы ищете? (ваш запрос)</label>
                        <input type="text" id="request_item" name="item" defaultValue={query} className="w-full py-2 px-3 bg-gray-100 rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" readOnly />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="request_name" className="block text-xs font-medium text-gray-600 mb-1">Ваше имя</label>
                        <input type="text" id="request_name" name="name" placeholder="Например, Иван" className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="request_contact" className="block text-xs font-medium text-gray-600 mb-1">Как с вами связаться? (Телефон или Email)</label>
                        <input type="text" id="request_contact" name="contact" placeholder="+7 900 123-45-67 или example@mail.com" className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="request_details" className="block text-xs font-medium text-gray-600 mb-1">Дополнительные детали (цвет, размер, бренд и т.п.)</label>
                        <textarea id="request_details" name="details" rows={2} placeholder="Любые уточнения, которые помогут специалисту в поиске..." className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />Оставить заявку специалисту
                    </button>
                  </form>
                </div>
                <p className="text-xs text-gray-500 mt-4">Это абсолютно бесплатно и ни к чему вас не обязывает. Мы просто хотим помочь!</p>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <FontAwesomeIcon icon={faUserClock} className="text-5xl text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Спасибо, {formData.name ? formData.name : 'ваша заявка'} передана специалисту!
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Наш эксперт получил ваш запрос на <strong className="text-blue-600">"{query}"</strong> и в ближайшее время приступит к индивидуальному подбору.
                </p>
                <p className="text-sm text-gray-600 mt-3 mb-6">
                  Мы свяжемся с вами по <strong className="text-blue-600">{formData.contact}</strong>, как только у специалиста будет информация.
                </p>
                <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />Отлично, буду ждать!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsContainer;
`;
}

// --- Data Files ---
function getItemsDataFileContent() {
    return `
export interface Item {
  id: number;
  name: string;
  category: string; // Consider using an enum or a more specific type
  price: string; // Consider number for calculations, then format for display
  image: string;
  provider: string;
  description: string;
}

export const itemsData: Item[] = [
  {
      id: 1,
      name: "Ваза 'Лазурь'",
      category: "Товары для дома",
      price: "2800 ₽",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNlcmFtaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Керамика 'Тепло'",
      description: "Элегантная керамическая ваза ручной работы, покрытая лазурной глазурью. Идеально дополнит ваш интерьер."
  },
  {
      id: 2,
      name: "Набор отверток 'Мастер'",
      category: "Ремонт и услуги",
      price: "1200 ₽",
      image: "https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9vbHNldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "ИнструментыПрофи",
      description: "Профессиональный набор из 12 отверток различного типа. Высококачественная сталь, удобные рукоятки."
  },
  {
      id: 3,
      name: "Картина 'Закат в горах'",
      category: "Хендмейд и творчество",
      price: "5500 ₽",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Арт-студия 'Вдохновение'",
      description: "Акриловая живопись на холсте, передающая красоту заката в горах. Размер 40x60 см."
  },
  {
      id: 4,
      name: "Беспроводные наушники 'AirSound'",
      category: "Электроника",
      price: "3990 ₽",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "ТехноГаджет",
      description: "Стильные беспроводные наушники с отличным качеством звука и длительным временем работы. Bluetooth 5.0."
  },
  {
      id: 5,
      name: "Футболка 'Минимализм'",
      category: "Одежда и аксессуары",
      price: "1500 ₽",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dCUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60",
      provider: "СтильГород",
      description: "Базовая хлопковая футболка унисекс с минималистичным принтом. Доступна в разных цветах."
  },
  {
      id: 6,
      name: "Книга 'Основы программирования'",
      category: "Книги и хобби",
      price: "950 ₽",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Книжный Мир",
      description: "Понятное руководство для начинающих программистов. Охватывает основные концепции и языки."
  },
  {
      id: 7,
      name: "Набор для ухода за кожей 'Сияние'",
      category: "Красота и здоровье",
      price: "3200 ₽",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbmNhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "БьютиЛаб",
      description: "Комплексный набор для ежедневного ухода за кожей лица. Включает очищающее средство, тоник и увлажняющий крем."
  },
  {
      id: 8,
      name: "Декоративная подушка 'Геометрия'",
      category: "Товары для дома",
      price: "1800 ₽",
      image: "https://images.unsplash.com/photo-1588058365548-68365341593d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "УютДекор",
      description: "Стильная декоративная подушка с геометрическим узором. Отлично подойдет для дивана или кресла."
  },
  {
      id: 9,
      name: "Услуга: Уборка квартиры",
      category: "Ремонт и услуги",
      price: "от 2500 ₽",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Чистый Дом Сервис",
      description: "Профессиональная уборка квартир и домов. Используем экологичные средства."
  }
];
`;
}

function getAppStateProviderContent() {
    return `
"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { Item } from '@/data/items'; // Ensure Item type is defined

// Define the shape of your context state
interface AppState {
  activeTab: string;
  isProductModalOpen: boolean;
  selectedProduct: Item | null;
  isCategoryViewOpen: boolean;
  categoryForView: string | null;
  isSearchOverlayOpen: boolean;
  searchStatusText: string;
  isSearchResultsOpen: boolean;
  searchQuery: string;
  notificationsCount: number; // Example
  favoritesCount: number;    // Example
  ordersBadgeCount: number;  // Example
}

// Define the shape of your context value (state + setters)
interface AppContextValue extends AppState {
  setActiveTab: Dispatch<SetStateAction<string>>;
  openProductModal: (item: Item) => void;
  closeProductModal: () => void;
  openCategoryItemsView: (categoryName: string) => void;
  closeCategoryItemsView: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  openSearchResults: (query: string) => void;
  closeSearchResults: () => void;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchStatusText: Dispatch<SetStateAction<string>>;
  // Add more setters or actions as needed
}

const defaultState: AppState = {
  activeTab: 'home',
  isProductModalOpen: false,
  selectedProduct: null,
  isCategoryViewOpen: false,
  categoryForView: null,
  isSearchOverlayOpen: false,
  searchStatusText: 'Анализирую ваш запрос...',
  isSearchResultsOpen: false,
  searchQuery: '',
  notificationsCount: 2, // Sample data
  favoritesCount: 0,   // Sample data
  ordersBadgeCount: 0,    // Sample data
};

export const AppStateContext = createContext<AppContextValue>(null!); // null! is okay if Provider always wraps

interface AppStateProviderProps {
  children: ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultState.activeTab);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(defaultState.isProductModalOpen);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(defaultState.selectedProduct);
  const [isCategoryViewOpen, setIsCategoryViewOpen] = useState<boolean>(defaultState.isCategoryViewOpen);
  const [categoryForView, setCategoryForView] = useState<string | null>(defaultState.categoryForView);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(defaultState.isSearchOverlayOpen);
  const [searchStatusText, setSearchStatusText] = useState<string>(defaultState.searchStatusText);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState<boolean>(defaultState.isSearchResultsOpen);
  const [searchQuery, setSearchQuery] = useState<string>(defaultState.searchQuery);
  
  // Example counts, can be managed with more complex logic or API calls
  const [notificationsCount, setNotificationsCount] = useState<number>(defaultState.notificationsCount);
  const [favoritesCount, setFavoritesCount] = useState<number>(defaultState.favoritesCount);
  const [ordersBadgeCount, setOrdersBadgeCount] = useState<number>(defaultState.ordersBadgeCount);

  // Scrollbar width effect
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', \`\${scrollbarWidth}px\`);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') { // Tab also closes modals as per original HTML
        if (isProductModalOpen) closeProductModal();
        else if (isCategoryViewOpen) closeCategoryItemsView();
        else if (isSearchResultsOpen) closeSearchResults();
        // Search overlay might not need esc/tab close or handled differently
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProductModalOpen, isCategoryViewOpen, isSearchResultsOpen]); // Re-add listener if dependencies change

  const manageBodyScroll = (shouldLock: boolean) => {
    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      // Only remove no-scroll if no other modal is active
      if (!isProductModalOpen && !isCategoryViewOpen && !isSearchResultsOpen && !isSearchOverlayOpen) {
         document.body.classList.remove('no-scroll');
      }
    }
  };
  
  // Update body scroll whenever a modal's state changes
  useEffect(() => {
    manageBodyScroll(isProductModalOpen || isCategoryViewOpen || isSearchResultsOpen || isSearchOverlayOpen);
  }, [isProductModalOpen, isCategoryViewOpen, isSearchResultsOpen, isSearchOverlayOpen]);


  const openProductModal = (item: Item) => {
    // Close other modals if necessary
    if (isCategoryViewOpen) setIsCategoryViewOpen(false); // Example: Close category view if opening product from it
    setSelectedProduct(item);
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const openCategoryItemsView = (categoryName: string) => {
    setCategoryForView(categoryName);
    setIsCategoryViewOpen(true);
  };
  const closeCategoryItemsView = () => {
    setIsCategoryViewOpen(false);
    setCategoryForView(null);
  };

  const openSearchOverlay = () => setIsSearchOverlayOpen(true);
  const closeSearchOverlay = () => setIsSearchOverlayOpen(false);

  const openSearchResults = (query: string) => {
    setSearchQuery(query); // Ensure query is set for the results container
    setIsSearchResultsOpen(true);
    closeSearchOverlay(); // Close loading overlay when results are ready
  };
  const closeSearchResults = () => {
    setIsSearchResultsOpen(false);
    setSearchQuery(''); // Clear query on close
  };

  const handleSetActiveTab = (tabId: string) => {
    // Close all modals when switching tabs
    closeProductModal();
    closeCategoryItemsView();
    closeSearchOverlay(); // Also close search processing
    closeSearchResults();
    setActiveTab(tabId);
    // Scroll to top of new tab content
    // This is tricky from context, page.tsx might handle its own main scroll area
    requestAnimationFrame(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.scrollTop = 0;
    });
  };


  const value: AppContextValue = {
    activeTab,
    isProductModalOpen,
    selectedProduct,
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    isSearchResultsOpen,
    searchQuery,
    notificationsCount,
    favoritesCount,
    ordersBadgeCount,
    setActiveTab: handleSetActiveTab, // Use wrapped setter
    openProductModal,
    closeProductModal,
    openCategoryItemsView,
    closeCategoryItemsView,
    openSearchOverlay,
    closeSearchOverlay,
    openSearchResults,
    closeSearchResults,
    setSearchQuery,
    setSearchStatusText,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
`;
}


// --- Public Files ---
function getPlaceholderSvgContent(name = "ikeber.svg") {
    if (name === "ikeber.svg") {
        // A simple placeholder SVG. Replace with actual ikeber.svg content if available.
        return `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="4" fill="#3B82F6"/>
<path d="M7 8L12 13L17 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 12L12 17L17 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
    }
    return ''; // For other SVGs if any
}


// =============================================================================
// == SETUP EXECUTION ==
// =============================================================================

async function runSetup() {
    log(`🚀 Starting setup for: ${config.projectName}`);
    log(`Framework: ${config.framework}, Project Type: ${config.projectType}`);

    try {
        const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
        const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
        log(`✅ Node.js version: ${nodeVersion}`);
        log(`✅ npm version: ${npmVersion}`);
    } catch (error) {
        console.error('[ERROR] Node.js or npm is not installed or not in PATH.');
        process.exit(1);
    }

    if (config.cleanupTargets && config.cleanupTargets.length > 0) {
        log('🧹 Cleaning up specified targets...');
        config.cleanupTargets.forEach(target => deleteFileOrDir(target));
    } else {
        log('🧼 Skipping cleanup (no targets specified).');
    }

    log('📦 Setting up package.json...');
    const packageJsonPath = path.join(config.projectDir, 'package.json');
    let finalPackageJson = {
        name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
        version: config.projectVersion,
        description: config.projectDescription,
        type: config.projectType,
        scripts: config.scripts,
        dependencies: config.dependencies,
        devDependencies: config.devDependencies,
        author: config.projectAuthor,
        license: config.projectLicense,
        private: true,
    };
     if (config.framework === 'nextjs') { // Next.js doesn't use 'main' in the same way
        delete finalPackageJson.main;
    }


    if (fs.existsSync(packageJsonPath)) {
        log('   Found existing package.json. Merging intelligently...');
        try {
            const existingPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            finalPackageJson = {
                 ...existingPackageJson,
                 name: finalPackageJson.name,
                 version: finalPackageJson.version,
                 description: finalPackageJson.description,
                 type: finalPackageJson.type,
                 author: finalPackageJson.author,
                 license: finalPackageJson.license,
                 private: finalPackageJson.private,
                 scripts: { ...existingPackageJson.scripts, ...config.scripts },
                 dependencies: { ...existingPackageJson.dependencies, ...config.dependencies },
                 devDependencies: { ...existingPackageJson.devDependencies, ...config.devDependencies },
            };
            if (config.framework === 'nextjs') {
                delete finalPackageJson.main;
            }
        } catch (e) {
            log(`[WARN] Error parsing existing package.json: ${e.message}. Overwriting with config.`);
        }
    }
    writeFile(packageJsonPath, JSON.stringify(finalPackageJson, null, 2));

    if (Object.keys(config.dependencies).length > 0 || Object.keys(config.devDependencies).length > 0) {
        log('🚚 Installing dependencies via npm...');
        runCommand('npm install');
    } else {
        log('🚫 No dependencies specified in config. Skipping npm install.');
    }

    log('📝 Creating project files...');

    // --- Standard Config/Meta Files ---
    writeFile(path.join(config.projectDir, '.gitignore'), getGitignoreContent());
    writeFile(path.join(config.projectDir, '.env.example'), getEnvExampleContent());
    writeFile(path.join(config.projectDir, 'README.md'), getReadmeContent());

    // --- Framework-Specific Config Files (Next.js) ---
    const nextConf = getNextConfigContent();
    writeFile(path.join(config.projectDir, nextConf.filename), nextConf.content);
    writeFile(path.join(config.projectDir, 'tsconfig.json'), getTsConfigContent());
    writeFile(path.join(config.projectDir, 'tailwind.config.ts'), getTailwindConfigContent());
    writeFile(path.join(config.projectDir, 'postcss.config.js'), getPostcssConfigContent());

    // --- Core Application Files (Next.js App Router) ---
    // Ensure src/app directory exists
    if (!fs.existsSync(config.appDir)) {
        fs.mkdirSync(config.appDir, { recursive: true });
        log(`Created directory: ${path.relative(config.projectDir, config.appDir)}`);
    }
    writeFile(path.join(config.appDir, 'globals.css'), getGlobalsCssContent());
    writeFile(path.join(config.appDir, 'layout.tsx'), getRootLayoutContent());
    writeFile(path.join(config.appDir, 'page.tsx'), getHomePageContent());


    // --- Component Files ---
    const components = {
        'Header.tsx': getHeaderComponentContent(),
        'NavigationBar.tsx': getNavigationBarComponentContent(),
        'ProductModal.tsx': getProductModalComponentContent(),
        'ProductCard.tsx': getProductCardComponentContent(),
        'tabs/HomeTab.tsx': getHomeTabComponentContent(),
        'tabs/CategoriesTab.tsx': getCategoriesTabContent(),
        'CategoryItemsView.tsx': getCategoryItemsViewComponentContent(),
        'tabs/OrdersTab.tsx': getOrdersTabContent(),
        'tabs/ProfileTab.tsx': getProfileTabContent(),
        'SearchOverlay.tsx': getSearchOverlayComponentContent(),
        'SearchResultsContainer.tsx': getSearchResultsContainerComponentContent(),
    };
    for (const [filename, contentGetter] of Object.entries(components)) {
        if (typeof contentGetter === 'function') {
            const content = contentGetter();
            if (content) writeFile(path.join(config.componentsDir, filename), content);
        } else if (typeof contentGetter === 'string') { // For direct content
             if (contentGetter) writeFile(path.join(config.componentsDir, filename), contentGetter);
        }
    }

    // --- Data Files ---
    if (!fs.existsSync(config.dataDir)) {
        fs.mkdirSync(config.dataDir, { recursive: true });
         log(`Created directory: ${path.relative(config.projectDir, config.dataDir)}`);
    }
    writeFile(path.join(config.dataDir, 'items.ts'), getItemsDataFileContent());

    // --- Context Files ---
    const contextDir = path.join(config.srcDir, 'context');
     if (!fs.existsSync(contextDir)) {
        fs.mkdirSync(contextDir, { recursive: true });
         log(`Created directory: ${path.relative(config.projectDir, contextDir)}`);
    }
    writeFile(path.join(contextDir, 'AppStateProvider.tsx'), getAppStateProviderContent());


    // --- Public Files ---
    if (!fs.existsSync(config.publicDir)) {
        fs.mkdirSync(config.publicDir, { recursive: true });
        log(`Created directory: ${path.relative(config.projectDir, config.publicDir)}`);
    }
    writeFile(path.join(config.publicDir, 'ikeber.svg'), getPlaceholderSvgContent('ikeber.svg'));
    // Create an empty favicon.ico to prevent 404s, Next.js might generate one later
    writeFile(path.join(config.publicDir, 'favicon.ico'), '');


    log('\n🎉 --- Setup Complete! --- 🎉');
    log('Next steps:');
    log('1. 👉 If you have actual API keys or specific URLs, create a `.env.local` file.');
    log('   Copy from `.env.example` and fill in your values.');
    log('2. 👀 Review the generated files, especially in `src/app/`, `src/components/`, and `src/context/`.');
    log('   Many components are placeholders or have simplified logic.');
    log('   Translate remaining JavaScript logic from the original HTML into React state and effects.');
    log('   Implement full functionality for state management in `AppStateProvider.tsx`.');
    log(`3. ▶️ Run the development server: \`npm run dev\`.`);
    log('4. Consider adding image domains to `next.config.mjs` if using external images (e.g., unsplash.com).');
    log('---------------------------\n');

    process.exit(0);
}

runSetup().catch(error => {
    console.error('\n[FATAL ERROR] Setup failed:', error);
    process.exit(1);
});