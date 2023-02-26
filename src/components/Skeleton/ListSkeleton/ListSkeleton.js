import { Skeleton } from "../Skeleton";

function ListSkeleton({ count }) {
  const renderTypes = () => {
    const types = [...Array(2)];

    return types.map((type, index) => (
      <span
        key={index}
        className="inline-block pr-2 py-1 leading-none rounded-full tracking-wide mr-1"
      >
        <Skeleton width={50} />
      </span>
    ));
  };

  const renderStats = () => {
    const stats = [...Array(4)];
    return stats.map((stat, index) => {
      return (
        <div key={index} className="flex flex-row">
          <span className="capitalize font-semibold text-lg flex-1">
            <Skeleton width={100} />
          </span>
          <span className="font-semibold text-lg">
            <Skeleton width={30} />
          </span>
        </div>
      );
    });
  };

  return (
    <>
      {[...Array(count)].map((s, index) => {
        return (
          <div key={index} className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-2">
            <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
              <Skeleton className="relative pb-48 overflow-hidden"></Skeleton>
              <div className="p-4">
                {renderTypes()}
                <h2 className="mt-2 mb-2 font-bold capitalize text-xl">
                  <Skeleton width={150} />
                </h2>

                <div className="py-4 border-t border-b text-xs">
                  {renderStats()}
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <Skeleton width={50} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export { ListSkeleton };
