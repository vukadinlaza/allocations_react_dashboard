import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// or scss:
import 'react-image-crop/lib/ReactCrop.scss';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'reactstrap';

// function ImageUploader({ src }) {
//   const [crop, setCrop] = useState({ aspect: 16 / 9 });
//   return <ReactCrop src={src} crop={crop} onChange={(newCrop) => setCrop(newCrop)} />;
// }

class ImageUploader extends React.PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 16 / 9,
    },
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => this.setState({ src: reader.result }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const croppedImage = new File([u8arr], filename, { type: mime });
    this.setState({ croppedImage });
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, 'dealLogo.jpeg');
      this.setState({ croppedImageUrl });
      console.log(croppedImageUrl);
      this.dataURLtoFile(croppedImageUrl, 'dealLogo.jpeg');
      console.log(this.state.croppedImage);
      //   this.props.updateDealLogo({ variables: { logo: croppedImageUrl, deal_id: this.props.deal_id } });
    }
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div>
        <div>
          <input type="file" accept="image/*" onChange={this.onSelectFile} />
          <Button onClick={() => {}}>Upload</Button>
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />}
      </div>
    );
  }
}

// export default ImageUploader;
// import React from 'react';
// import ImageUploader from 'react-images-upload';

// class imageUploader extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { pictures: [] };
//     this.onDrop = this.onDrop.bind(this);
//   }

//   onDrop(picture) {
//     this.setState({
//       pictures: this.state.pictures.concat(picture),
//     });
//     console.log(this.state.pictures);
//   }

//   render() {
//     console.log(this.state.pictures);
//     return (
//       <>
//         <ImageUploader
//           withIcon
//           buttonText="Choose images"
//           onChange={this.onDrop}
//           imgExtension={['.jpg', '.gif', '.png', '.gif']}
//           maxFileSize={5242880}
//         />
//       </>
//     );
//   }
// }

export default ImageUploader;
