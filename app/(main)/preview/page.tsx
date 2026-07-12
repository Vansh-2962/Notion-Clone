import PreviewPage from "@/app/_components/PreviewPage"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string
    r?: string
  }>
}) {
  const { id, r } = await searchParams

  return <PreviewPage id={id} reason={r} />
}
