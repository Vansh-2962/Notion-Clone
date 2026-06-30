import { Doc } from "@/convex/_generated/dataModel"
import { Document } from "../types/types"
import DocsList from "./DocsList"

interface FavDocsListProps {
  docs: Doc<"documents">[]
}

const FavDocsList = ({ docs }: FavDocsListProps) => {
  const favouriteDocs =
    (docs &&
      docs.length > 0 &&
      docs.filter((doc: Document) => doc.isFavourite)) ||
    []

  return (
    <main>
      <div>
        {favouriteDocs?.length > 0 && (
          <span className="px-5 text-xs font-bold">FAVOURITES</span>
        )}

        <DocsList docs={favouriteDocs} />
      </div>
    </main>
  )
}

export default FavDocsList
