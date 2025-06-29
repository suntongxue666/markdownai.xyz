// src/components/Navigation.tsx
"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils'; // 确保这个路径正确
import { usePathname } from 'next/navigation'; // <-- 引入 usePathname

export function Navigation() {
  const pathname = usePathname(); // <-- 获取当前路径

  const navItems = [
    { name: 'PDF to Markdown', href: '/pdftomarkdown' },
    { name: 'HTML to Markdown', href: '/htmltomarkdown' },
    { name: 'Word to Markdown', href: '/wordtomarkdown' },
  ];

  return (
    <nav className="mt-4 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
      <ul className="flex flex-wrap justify-center gap-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                pathname === item.href
                  ? 'text-blue-600 dark:text-blue-400' // 激活状态的蓝色
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50' // 默认和悬停状态
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* 未来可以在这里添加登录、积分、订阅等按钮 */}
      {/* <div className="flex space-x-2">
        <Button variant="ghost">Login</Button>
        <Button variant="ghost">Points</Button>
        <Button variant="ghost">Subscribe</Button>
      </div> */}
    </nav>
  );
}