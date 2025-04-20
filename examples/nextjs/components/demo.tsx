import CutoutEditor from 'react-cutout-editor';

export default function Demo() {
  return (
    <div className="h-screen">
      <CutoutEditor maskImgUrl="/maskdemo.png" imgUrl="/test.webp" />
    </div>
  );
}
