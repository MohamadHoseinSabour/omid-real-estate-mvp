import BottomNavBar from "@/components/ui/bottom-nav-bar";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";

const CDN = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev";

const IMAGES = [
  {
    src: `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg`,
    alt: "Diver silhouetted inside a sunset seascape shaped like a profile",
  },
  {
    src: `${CDN}/gradients/hero_gradient/hero-gradients-01.png`,
    alt: "Soft multi-tone gradient wash",
  },
  {
    src: `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg`,
    alt: "Double-exposure portrait blended with a city skyline at dusk",
  },
  {
    src: `${CDN}/gradients/crimson_aura/crimson-aura-02.png`,
    alt: "Crimson aura gradient",
  },
  {
    src: `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg`,
    alt: "Motion-blurred side-profile portrait against a deep orange backdrop",
  },
  {
    src: `${CDN}/gradients/hue-flow/hue-flow-01.png`,
    alt: "Flowing hue gradient",
  },
  {
    src: `${CDN}/stock-images/d8916d863f64062635bc796d192e2e92.jpg`,
    alt: "Silhouetted couple walking on a dusk beach with reflective wet sand",
  },
  {
    src: `${CDN}/gradients/halo/halo-04.png`,
    alt: "Glowing halo gradient",
  },
  {
    src: `${CDN}/stock-images/c8e54546cf7f520be357e60058b75e7a.jpg`,
    alt: "Close-up portrait with sunset light cutting across the face",
  },
  {
    src: `${CDN}/gradients/ambient_glow/ambient-glow-01.png`,
    alt: "Ambient gradient glow",
  },
];

export function ImageStreamDemo() {
  return (
    <ImageStreamHero
      images={IMAGES}
      className="h-[560px] w-full rounded-lg border border-border bg-background"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <div className="px-6">
          <h1 className="text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Your work,
            <br />
            front and centre.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-muted-foreground">
          A hero that leads with the images instead of describing them. Swap in
          your own and the corridor rebuilds around them.
        </p>
      </div>
    </ImageStreamHero>
  );
}

export function BottomNavBarDemo() {
  return <BottomNavBar />;
}

export default function Demo() {
  return <BottomNavBar />;
}
