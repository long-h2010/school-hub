import { ProductImage } from '@/types';
import { Card, Image } from 'antd';

export const ProductImages = ({ images }: { images: ProductImage[] }) => {
  const thumbnail = images.filter((img) => img.isThumbnail == true)[0].url;
  const imgs = images
    .filter((img) => img.isThumbnail == false)
    .map((img) => img.url);

  return (
    <Card>
      <div className='flex flex-col gap-3'>
        <div className='flex-1 gallery-main'>
          <Image src={thumbnail} />
        </div>
        <div className='flex gap-2 shrink-0'>
          {imgs.map((img, idx) => (
            <Image key={idx} src={img} width={56} height={56} />
          ))}
        </div>
      </div>
    </Card>
  );
};
