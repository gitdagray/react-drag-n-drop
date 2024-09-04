import { List } from "@/components/List"

const getData = async () => {
  const res = await fetch('http://localhost:3500/data')
  const data = await res.json()
  return data
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="flex min-h-dvh p-8">
      <List data={data} />
    </main>
  )
}
