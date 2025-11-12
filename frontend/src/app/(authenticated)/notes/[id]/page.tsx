export default async function NoteDetailPage({
  params,
}: PageProps<"/notes/[id]">) {
  const { id } = await params;
  return <div>ノート詳細ページ: {id}</div>;
}
