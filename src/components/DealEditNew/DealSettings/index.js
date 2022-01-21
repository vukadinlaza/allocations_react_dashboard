import { FormControl, TextField, Button, Menu, MenuItem, FormLabel } from '@material-ui/core';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.scss';
import { toast } from 'react-toastify';
import ReactCrop from 'react-image-crop';
import { useMutation, gql } from '@apollo/client';
import 'react-image-crop/lib/ReactCrop.scss';
import CopyIcon from '../../../assets/copy-icon.svg';
import DocumentIcon from '../../../assets/document-icon.svg';
import DocumentMenuIcon from '../../../assets/document-menu-icon.svg';

const ADD_DOC = gql`
  mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
    addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
    }
  }
`;

const RM_DOC = gql`
  mutation RmDoc($deal_id: String!, $title: String!) {
    rmDealDoc(deal_id: $deal_id, title: $title) {
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

const RM_LOGO = gql`
  mutation rmDealLogo($deal_id: String!) {
    rmDealLogo(deal_id: $deal_id) {
      _id
    }
  }
`;

function DealSettings({ formData, setFormData, refetch }) {
  const [addDoc] = useMutation(ADD_DOC, {
    onCompleted: () => {
      toast.success('Success! Your document has been added');
      refetch();
    },
  });
  const [rmDoc] = useMutation(RM_DOC, {
    onCompleted: () => {
      toast.success('Deal settings have been updated');
      refetch();
    },
  });
  const [rmDealLogo] = useMutation(RM_LOGO, {
    onCompleted: () => {
      toast.success('Deal cover image has been deleted');
      refetch();
    },
  });

  const [doc, setDoc] = useState(null);
  const [wireInstructions, setWireInstructions] = useState(null);

  const { _id, documents, last_valuation, docSpringTemplateId, slug, dealCoverImageKey } = formData;

  const DealDocumentItem = ({ document }) => {
    const [documentMenuAnchorEl, setDocumentMenuAnchorEl] = useState(null);
    const [toggleDocMenuOpen] = useState(false);

    const handleDocumentMenuClick = (event) => {
      setDocumentMenuAnchorEl(event.currentTarget);
      toggleDocMenuOpen((open) => !open);
    };

    const handleClose = () => {
      setDocumentMenuAnchorEl(null);
    };

    const deleteDealDocument = () => {
      if (window.confirm(`Delete ${document.path} document?`)) {
        rmDoc({ variables: { deal_id: _id, title: document.path } });
      }
    };

    return (
      <li className="document-item">
        <a
          className="document-link"
          href={`https://${document.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={DocumentIcon} alt="document icon" />
          <p className="document-title">{document.path}</p>
        </a>
        <Button
          className="document-menu-button"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleDocumentMenuClick}
        >
          <img src={DocumentMenuIcon} alt="document menu icon" />
        </Button>

        <Menu
          className="document-menu"
          id="simple-path"
          anchorEl={documentMenuAnchorEl}
          keepMounted
          open={Boolean(documentMenuAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={deleteDealDocument}>Delete Document</MenuItem>
        </Menu>
      </li>
    );
  };

  const dealDocumentItems = documents?.map((doc) => {
    return <DealDocumentItem document={doc} />;
  });

  const submitDoc = () => {
    if (doc?.doc && doc?.title) {
      addDoc({ variables: { deal_id: formData._id, ...doc } });
    }
  };

  const submitWireInstructions = () => {
    if (wireInstructions?.doc && wireInstructions?.title) {
      addDoc({ variables: { deal_id: formData._id, ...wireInstructions } });
    }
  };

  const handleLinkCopy = () => {
    navigator.clipboard.writeText(window.origin + (formData.appLink || ''));
    toast.success('Success! Copied deal link to clipboard');
  };

  const handleFormChange = ({ target }) => {
    const dealParamFields = [
      'managementFees',
      'managementFeeType',
      'estimatedTerm',
      'totalCarry',
      'estimatedSetupCosts',
    ];

    if (dealParamFields.includes(target.name)) {
      return setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          [target.name]: target.value,
        },
      }));
    }

    return setFormData((prevData) => ({
      ...prevData,
      [target.name]: target.value,
    }));
  };

  function AddDealLogo() {
    const [addLogo] = useMutation(ADD_LOGO, {
      onCompleted: () => {
        toast.success('Logo has been added');
        refetch();
      },
      onError: (err) => {
        console.log('Error:', err);
      },
    });
    const [imgSrc, setImgSrc] = useState(
      `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`,
    );
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 675 / 248 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropperOpen, setCropperOpen] = useState(false);

    useEffect(() => {
      setImgSrc(`https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`);
    }, []);

    const submitCrop = (canvas, crop) => {
      if (!crop || !canvas) {
        return;
      }

      canvas.toBlob(
        (blob) => {
          setCroppedImage({ logo: blob, title: 'dealCoverImage.png' });
        },
        'image/png',
        1,
      );
    };

    const submitLogo = () => {
      if (croppedImage.logo && croppedImage.title) {
        addLogo({
          variables: { deal_id: formData._id, ...croppedImage, title: croppedImage.title },
        });
      }
    };

    const removeLogo = () => {
      if (dealCoverImageKey && window.confirm('Delete deal cover image?')) {
        rmDealLogo({ variables: { deal_id: _id } });
      }
    };

    const onSelectFile = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
        setCropperOpen(true);
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
        crop.height,
      );
    }, [completedCrop]);

    return (
      <div className="banner-upload" style={{ width: '100%' }}>
        <FormControl className="upload">
          <FormLabel className="field-label">
            Upload cover photo
            <div className="upload-container">
              <div className="button-container">
                <Button className="attach-button" variant="contained" component="label">
                  Attach
                  <input type="file" hidden accept="image/*" onChange={onSelectFile} />
                </Button>
                <p>
                  {dealCoverImageKey
                    ? 'dealCoverImage.png'
                    : croppedImage?.title || 'No image selected'}
                </p>
              </div>
            </div>
          </FormLabel>

          <Button
            disabled={completedCrop === null}
            onClick={submitLogo}
            className={`upload-button ${completedCrop === null ? 'disabled' : ''}`}
          >
            Upload to deal
          </Button>
        </FormControl>

        {dealCoverImageKey && (
          <div className="image-preview-container">
            <img className="image-preview" alt={slug} src={imgSrc} />
            <Button onClick={removeLogo} className="delete-image">
              Delete Image
            </Button>
          </div>
        )}

        {cropperOpen && (
          <div className="image-crop-container">
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
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />

            <Button
              className="crop-button"
              onClick={() => {
                submitCrop(previewCanvasRef.current, completedCrop);
                setCropperOpen(false);
              }}
            >
              Crop Image
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="DealSettings">
      <h2>Deal Settings</h2>

      <div className="form-fields">
        <FormControl className="field">
          <FormLabel className="field-label">
            Last valuation ($)
            <TextField
              value={last_valuation || ''}
              name="last_valuation"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            DocSpring Template ID
            <TextField
              name="docSpringTemplateId"
              onChange={handleFormChange}
              value={docSpringTemplateId || ''}
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        {documents && (
          <div className="deal-documents">
            <FormLabel className="field-label">
              Deal Documents
              <ul className="document-list">{dealDocumentItems}</ul>
            </FormLabel>
          </div>
        )}

        <AddDealLogo />

        <FormControl className="upload">
          <FormLabel className="field-label">
            Upload wire instructions
            <div className="upload-container">
              <div className="button-container">
                <Button className="attach-button" variant="contained" component="label">
                  Attach
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={({ target }) => {
                      if (target.validity.valid) {
                        setWireInstructions({
                          doc: target.files[0],
                          title: 'wire-instructions',
                        });
                      }
                    }}
                    hidden
                  />
                </Button>
                <p>{wireInstructions?.title || 'No file selected'}</p>
              </div>
            </div>
          </FormLabel>

          <Button
            disabled={wireInstructions === null}
            onClick={submitWireInstructions}
            className={`upload-button ${wireInstructions === null ? 'disabled' : ''}`}
          >
            Upload to deal
          </Button>
        </FormControl>

        <FormControl className="upload">
          <FormLabel className="field-label">
            Upload documents
            <div className="upload-container">
              <div className="button-container">
                <Button className="attach-button" variant="contained" component="label">
                  Attach
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={({ target }) => {
                      if (target.validity.valid && target.files[0]) {
                        setDoc({
                          doc: target.files[0],
                          title: target.files[0].name,
                        });
                      }
                    }}
                    hidden
                  />
                </Button>
                <p>{doc?.doc?.name || 'No file selected'}</p>
              </div>
            </div>
          </FormLabel>
          <Button
            disabled={doc === null}
            onClick={submitDoc}
            className={`upload-button ${doc === null ? 'disabled' : ''}`}
          >
            Upload to deal
          </Button>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Deal ID
            <TextField disabled value={_id || ''} className="text-input" variant="outlined" />
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Live deal link
            <TextField
              className="text-input"
              value={formData.appLink ? window.origin + (formData.appLink || '') : ''}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Button onClick={handleLinkCopy} className="copy-button">
                    <img src={CopyIcon} alt="Copy Icon" />
                  </Button>
                ),
              }}
            />
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default DealSettings;
