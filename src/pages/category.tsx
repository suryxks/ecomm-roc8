import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { CategoryPagesNav } from "../components/ui/CategoryPagination";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Oval } from "react-loader-spinner";
import { Button } from "~/components/ui/button";

export default function CategoriesPage() {
  const router = useRouter();
  const pathname = router.query;
  const totalPages = Math.round(100 / 6);
  const currentPage = Number(pathname.page) ?? 1;
  const { data, isLoading, error } = api.category.getPaginated.useQuery(
    {
      page: currentPage,
    },
    {
      refetchOnMount: false,

      refetchOnWindowFocus: false,
    },
  );
  const { mutate: logout } = api.auth.logout.useMutation({
    onMutate: async () => await router.push("login"),
  });
  if (error?.shape?.data.httpStatus == 401) {
    void router.push("/login");
  }
  const { data: user } = api.auth.getUserId.useQuery(null, {
    refetchOnWindowFocus: false,
  });
  const ctx = api.useUtils();
  const { mutate } = api.category.selectCategory.useMutation({
    onMutate: async (currentCategory) => {
      if (user?.userId) {
        await ctx.category.getPaginated.cancel();
        ctx.category.getPaginated.setData(
          { page: currentPage },
          {
            ...data,
            categories:
              data?.categories !== undefined
                ? data.categories.map((category) => {
                    if (category.id !== currentCategory.categoryId) {
                      return category;
                    }
                    if (currentCategory.intent === "connect") {
                      return {
                        ...category,
                        users: category.users.concat([{ id: user.userId }]),
                      };
                    } else {
                      return {
                        ...category,
                        users: category.users.filter(
                          (person) => person.id !== user.userId,
                        ),
                      };
                    }
                  })
                : undefined,
          },
        );
      }
    },
    onSettled: async () => {
      await ctx.category.getPaginated.invalidate({ page: currentPage });
    },
    onError: async () => {
      await ctx.category.getPaginated.invalidate({ page: currentPage });
    },
  });
  if (isLoading) {
    return (
      <div className="w-xl mx-auto w-fit">
        <Oval color="#09090B" secondaryColor="#E4E4E7" height={60} width={60} />
      </div>
    );
  }
  return (
    <>
      <div className="w-xl mx-auto  flex w-fit flex-col justify-center rounded-2xl border-2 p-12">
        <h1 className="m-2 mx-auto w-fit text-2xl font-bold ">
          Please mark your interests!
        </h1>
        <div className="mx-auto w-fit">We will keep you notified.</div>
        <div className="m-12  flex  w-fit flex-col gap-2">
          {data
            ? data.categories.map((category) => {
                const checked = category.users.find(
                  (person) => person.id === user?.userId,
                )
                  ? true
                  : false;
                return (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.name}
                      onClick={() => {
                        mutate({
                          category: category.name,
                          categoryId: category.id,
                          intent: checked === true ? "disconnect" : "connect",
                        });
                      }}
                      checked={checked}
                    />
                    <Label htmlFor={category.name} className="">
                      {category.name}
                    </Label>
                  </div>
                );
              })
            : "Error Loading data"}
        </div>
        <CategoryPagesNav currentPage={currentPage} totalPages={totalPages} />
      </div>
      <div className="w-xl mx-auto mt-4 w-fit">
        <Button
          onClick={() => {
            logout();
          }}
          className="mx-auto w-fit"
        >
          Logout
        </Button>
      </div>
    </>
  );
}
