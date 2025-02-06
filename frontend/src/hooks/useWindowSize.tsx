export default function useWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
  };
}
