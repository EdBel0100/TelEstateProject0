import Providers from "./providers"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
   <Providers>{children}</Providers>
  )
}

export default layout
