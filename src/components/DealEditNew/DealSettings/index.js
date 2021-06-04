import { FormControl, TextField, Button } from '@material-ui/core'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import './styles.scss'
import CopyIcon from '../../../assets/copy-icon.svg'
import { toast } from 'react-toastify';
import ReactCrop from 'react-image-crop';
import { gql } from 'apollo-boost';
import { useSimpleReducer } from '../../../utils/hooks';
import { useMutation } from '@apollo/react-hooks';
import 'react-image-crop/lib/ReactCrop.scss';

const ADD_DOC = gql`
  mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
    addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
    }
  }
`;

const ADD_LOGO = gql`
  mutation AddDealLogo($deal_id: String!, $title: String!, $logo: Upload!) {
    addDealLogo(deal_id: $deal_id, title: $title, logo: $logo) {
      _id
    }
  }
`;




function DealSettings({ formData, setFormData, refetch }) {


  const [addDoc, { data, error }] = useMutation(ADD_DOC);
  const [doc, setDoc] = useState(null);
  const [wireInstructions, setWireInstructions] = useState(null);


  const submitDoc = () => {
    if (doc?.doc && doc?.title) {
      addDoc({ variables: { deal_id: formData._id, ...doc } });
    }
  };

  const submitWireInstructions = () => {
    if (wireInstructions?.doc && wireInstructions?.title) {
      addDoc({ variables: { deal_id: formData._id, ...wireInstructions } });
    }
  }

  const {
    last_valuation,
    _id,
    docSpringTemplateId
  } = formData


  const handleLinkCopy = () => {
    navigator.clipboard.writeText(window.origin + (formData.appLink || ''))
    toast.success('Copied deal link to clipboard.')
  }

  const handleFormChange = ({ target }) => {

    const dealParamFields = ['managementFees', 'managementFeeType', 'estimatedTerm', 'totalCarry', 'estimatedSetupCosts']

    if (dealParamFields.includes(target.name)) {
      return setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          [target.name]: target.value
        }
      }))
    }

    return setFormData(prevData => ({
      ...prevData,
      [target.name]: target.value
    }))
  }




  function AddDealLogo() {
    const [addLogo, { data, error }] = useMutation(ADD_LOGO);


    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null)
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropperOpen, setCropperOpen] = useState(false)


    const submitCrop = (canvas, crop) => {
      if (!crop || !canvas) {
        return;
      }

      canvas.toBlob(
        (blob) => {
          setCroppedImage({ logo: blob, title: 'dealCoverImage.png' })
        },
        'image/png',
        1
      );
    }


    const submitLogo = () => {
      if (croppedImage.logo && croppedImage.title) {
        addLogo({ variables: { deal_id: formData._id, ...croppedImage, title: croppedImage.title } });
      }
    };

    const onSelectFile = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
        setCropperOpen(true)
      }
    };

    const onImageLoaded = useCallback((img) => {
      imgRef.current = img;
    }, []);

    useEffect(() => {
      if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
        return;
      }

      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }, [completedCrop]);

    return (
      <div style={{ width: '100%' }}>

        <FormControl className="upload">

          <label className="field-label">
            Upload cover photo
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                </Button>
                <p>{croppedImage?.title || 'No image selected'}</p>
              </div>
            </div>
          </label>

          <Button
            disabled={completedCrop === null}
            onClick={submitLogo}
            className="upload-button"
          >
            Upload to deal
        </Button>
        </FormControl>

        {cropperOpen && (<div className="image-crop-container">
          <ReactCrop
            src={upImg}
            onImageLoaded={onImageLoaded}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="image-cropper"
          />

          <canvas
            hidden
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0)
            }}
          />

          <Button
            className="crop-button"
            onClick={() => {
              submitCrop(previewCanvasRef.current, completedCrop)
              setCropperOpen(false)
            }}
          >
            Crop Image
          </Button>
        </div>)}

      </div>
    );
  }


  return (
    <section className="DealSettings">
      <h2>Deal Settings</h2>

      <div className="form-fields">

        <FormControl className="field">

          <label className="field-label">
            Last valuation ($)
            <TextField
              value={last_valuation || ''}
              name="last_valuation"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
            />
          </label>

        </FormControl>

        <FormControl className="field">

          <label className="field-label">
            DocSpring Template ID
            <TextField
              name="docSpringTemplateId"
              onChange={handleFormChange}
              value={docSpringTemplateId || ''}
              className="text-input"
              variant="outlined"
            />
          </label>

        </FormControl>

        <AddDealLogo />

        <FormControl className="upload">

          <label className="field-label">
            Upload wire instructions
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={({ target }) => {
                      if (target.validity.valid) {
                        setWireInstructions({
                          doc: target.files[0],
                          title: 'wire-instructions.pdf'
                        })
                      };
                    }}
                    hidden
                  />
                </Button>
                <p>{wireInstructions?.title || 'No file selected'}</p>

              </div>
            </div>
          </label>

          <Button
            disabled={wireInstructions === null}
            onClick={submitWireInstructions}
            className="upload-button"
          >
            Upload to deal
          </Button>

        </FormControl>

        <FormControl className="upload">
          <label className="field-label">
            Upload documents
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={({ target }) => {
                      if (target.validity.valid && target.files[0]) {
                        setDoc({
                          doc: target.files[0],
                          title: target.files[0].name
                        })
                      };
                    }}
                    hidden
                  />
                </Button>
                <p>{doc?.doc?.name || 'No file selected'}</p>

              </div>
            </div>
          </label>
          <Button
            disabled={doc === null}
            onClick={submitDoc}
            className="upload-button"
          >
            Upload to deal
          </Button>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Deal ID
            <TextField
              disabled={true}
              value={_id || ''}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Live deal link
            <TextField
              className="text-input"
              value={formData.appLink ? window.origin + (formData.appLink || '') : ''}
              variant="outlined"
              InputProps={{
                endAdornment: <Button
                  onClick={handleLinkCopy}
                  className="copy-button">
                  <img src={CopyIcon} />
                </Button>
              }}
            />
          </label>
        </FormControl>

      </div>

    </section>
  )
}

export default DealSettings
