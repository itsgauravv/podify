import React, { useCallback } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselProps } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from "./LoaderSpinner";

const Carousel = ({ fansLikeDetail }: CarouselProps) => {
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  console.log("fansLikeDetail", fansLikeDetail);

  const slides =
    fansLikeDetail &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fansLikeDetail?.filter((item: any) => item?.totalPodcasts > 0);

  if (!slides) return <LoaderSpinner />;

  console.log("slides", slides[0]?.podcast);

  return (
    <section
      className="flex flex-col gap-4 w-full overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex w-full">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="carousel_box"
            onClick={() =>
              router.push(`/podcasts/${item.podcast[0]?.podcastId}`)
            }
          >
            <Image
              src={item?.imageUrl}
              alt="card"
              fill
              className="absolute size-full rounded-xl border-none"
            />
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">
                {item?.podcast[0]?.podcastTitle}
              </h2>
              <p className="text-12 font-normal text-white-2">{item?.name}</p>
            </div>
          </figure>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
