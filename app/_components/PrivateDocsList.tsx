import { Doc } from "@/convex/_generated/dataModel"
import { Document } from "../types/types"
import DocsList from "./DocsList"

interface FavDocsListProps {
  docs: Doc<"documents">[]
}

const PrivateDocsList = ({ docs }: FavDocsListProps) => {
  const privateDocs =
    (docs &&
      docs.length > 0 &&
      docs.filter((doc: Document) => doc.isPrivate)) ||
    []

  return (
    <main>
      <div>
        {privateDocs?.length > 0 && (
          <span className="px-5 text-xs font-bold">PRIVATE</span>
        )}
        <DocsList docs={privateDocs} />
      </div>
    </main>
  )
}

export default PrivateDocsList
