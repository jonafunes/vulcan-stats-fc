import Home from "@/components/Home"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Vulcan FC Stats",
  description: "Descubri las estadísticas de VULCAN FC",
}

export default function HomePage() {
  return (
    <Home/>
  )
}
