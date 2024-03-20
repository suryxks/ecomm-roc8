import { FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
interface CategoryPagesNavProps {
  currentPage: number;
  totalPages: number;
}
export const CategoryPagesNav: FC<CategoryPagesNavProps> = ({
  currentPage,
  totalPages,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`/category?page=${currentPage <= 1 ? currentPage : currentPage - 1}`}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        {currentPage == 2 ? (
          <>
            {" "}
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage - 1}`}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : null}
        {currentPage >= 3 ? (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage - 2}`}>
                {currentPage - 2}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage - 1}`}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : null}
        <PaginationItem>
          <PaginationLink href={`/category?page=${currentPage}`} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage <= totalPages - 2 ? (
          <>
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage + 1}`}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage + 2}`}>
                {currentPage + 2}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        ) : null}
        {currentPage == totalPages - 1 ? (
          <>
            {" "}
            <PaginationItem>
              <PaginationLink href={`/category?page=${currentPage + 1}`}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : null}
        <PaginationItem>
          <PaginationNext
            href={`/category?page=${currentPage >= totalPages ? currentPage : currentPage + 1}`}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
