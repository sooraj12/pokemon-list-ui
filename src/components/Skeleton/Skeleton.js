import SkeletonLoader, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Skeleton(props) {
  return (
    <SkeletonTheme color="#c4cdd5" highlightColor="#f4f6f8">
      <SkeletonLoader {...props} />
    </SkeletonTheme>
  );
}

export { Skeleton };
