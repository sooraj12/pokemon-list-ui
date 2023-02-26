import SkeletonLoader, {
  SkeletonProps,
  SkeletonTheme,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Skeleton(props: SkeletonProps) {
  return (
    <SkeletonTheme highlightColor="#f4f6f8">
      <SkeletonLoader {...props} />
    </SkeletonTheme>
  );
}

export { Skeleton };
