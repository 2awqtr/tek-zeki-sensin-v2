import { GithubIcon, TwitterIcon } from '@/components/icons';
import { fontSans } from '@/config/fonts';
import { siteConfig, zozak } from '@/config/site';
import '@/styles/globals.css';
import { Button, Link, Snippet } from '@nextui-org/react';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  icons: {
    icon: '/mande.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>

            <footer className="w-full flex flex-col items-center justify-center py-3">
         

              <p className="font-semibold font-sans">Feel free to support me</p>
              <Snippet
                className="bg-transparent text-sm"
                symbol=""
                color="primary"
              >
                {zozak}
              </Snippet>
              <div className="flex">
                <Button
                  as={Link}
                  isExternal
                  href="https://twitter.com/Zozak42/status/1788662647019237666"
                  className="bg-transparent"
                >
                  <span className="font-bold">Like</span>
                  <TwitterIcon />
                </Button>
                <Button
                  as={Link}
                  isExternal
                  href="https://github.com/AkifhanIlgaz/tek-zeki-sensin"
                  className="bg-transparent"
                >
                  <span className="font-bold">Star</span>
                  <GithubIcon />
                </Button>
              </div>
              <p className="font-light font-sans">
                If you have encountered any issue please open issue on GitHub
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
