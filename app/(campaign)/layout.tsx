"use client";
import { ClientLayout } from '@/components/layout/client-layout'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { IndexStrip } from '@/components/layout/index-strip'
import { Preloader } from '@/components/layout/preloader'
import { PropsWithChildren } from 'react'

const Layout = ({children}: PropsWithChildren) => {
  return (
    <>  
        <Preloader />
        <ClientLayout>
            <Header />
            <IndexStrip />
            <main className="max-w-site mx-auto">{children}</main>
            <Footer />
        </ClientLayout>
    </>
  )
}

export default Layout
