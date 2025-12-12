import Image from "next/image";
import "./image-section.scss";

const ImageSection = ({ slice }) => {
  const { image } = slice.primary;
  return (
    <section className="image-section">
      <div className="image-section__image">
        {image?.url && (
          <Image src={image.url} alt="" width={2000} height={700} />
        )}
      </div>
    </section>
  );
};

export default ImageSection;
