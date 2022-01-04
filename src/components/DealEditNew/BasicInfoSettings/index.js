import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './styles.scss';
import { FormControl, TextField, Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import InputAdornment from '@material-ui/core/InputAdornment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { nWithCommas } from '../../../utils/numbers.js';

function BasicInfoSettings({ formData, setFormData, loading }) {
  const handleFormChange = ({ target }) => {
    const dealParamFields = ['dealType', 'minimumInvestment'];

    if (dealParamFields.includes(target.name)) {
      return setFormData((prevState) => ({
        ...prevState,
        dealParams: {
          ...prevState.dealParams,
          [target.name]: target.value,
        },
      }));
    }

    return setFormData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  const handleButtonClick = (field, value) => {
    const dealParamFields = ['dealType', 'minimumInvestment', 'is3c7'];

    if (dealParamFields.includes(field)) {
      console.log('fires', field, value);
      return setFormData((prevState) => ({
        ...prevState,
        dealParams: {
          ...prevState.dealParams,
          [field]: value,
        },
      }));
    }

    return setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const { investmentType, status, dealParams } = formData;

  console.log('XXXXX', dealParams);

  const minimumInvesmentPlaceholder =
    dealParams.minimumInvestment !== null && dealParams.minimumInvestment
      ? nWithCommas(dealParams.minimumInvestment)
      : '1,000';

  return (
    <section className="BasicInfoSettings">
      <h2 className="key-highlights">Key highlights</h2>

      <Editor
        className="memo-editor"
        value={formData.memo || ''}
        apiKey="jlbrhzgo0m2myqdmbhaav8a0971vomza2smty20fpq6fs47j"
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor image media | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help',
          file_picker_types: 'image',
          file_picker_callback(cb, value, meta) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
              const file = this.files[0];

              const reader = new FileReader();
              reader.onload = function () {
                const id = `blobid${new Date().getTime()}`;
                const { blobCache } = window.tinymce.activeEditor.editorUpload;
                const base64 = reader.result.split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}
        onEditorChange={(value) => {
          setFormData((prevData) => ({
            ...prevData,
            memo: value,
          }));
        }}
      />

      <div className="form-fields">
        <FormControl className="field">
          <label className="field-label">
            Company name
            <TextField
              name="company_name"
              onChange={handleFormChange}
              value={formData.company_name || ''}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Company description
            <TextField
              name="company_description"
              onChange={handleFormChange}
              value={formData.company_description || ''}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Target raise
            <TextField
              className="currency-text-input"
              value={formData.target || ''}
              name="target"
              onChange={handleFormChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Investment type
            <div className="button-options">
              <Button
                onClick={() => handleButtonClick('investmentType', 'spv')}
                className={`option-button ${investmentType === 'spv' && 'selected'}`}
                name="investmentType"
                value="fund"
                variant="outlined"
              >
                SPV
              </Button>
              <Button
                onClick={() => handleButtonClick('investmentType', 'fund')}
                className={`option-button ${investmentType === 'fund' && 'selected'}`}
                name="investmentType"
                value="fund"
                variant="outlined"
              >
                Fund
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Minimum investment
            <CurrencyTextField
              className="currency-text-input"
              variant="outlined"
              value={dealParams.minimumInvestment}
              placeholder={minimumInvesmentPlaceholder}
              currencySymbol="$"
              textAlign="left"
              name="minimumInvestment"
              outputFormat="string"
              decimalCharacter="."
              decimalPlaces={0}
              digitGroupSeparator=","
              onChange={(event, value) => {
                setFormData((prev) => ({
                  ...prev,
                  dealParams: {
                    ...prev.dealParams,
                    minimumInvestment: value.toString(),
                  },
                }));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Deal type
            <div className="button-options">
              <Button
                onClick={() => handleButtonClick('dealType', '506b')}
                className={`option-button ${dealParams.dealType === '506b' && 'selected'}`}
                variant="outlined"
              >
                506b
              </Button>
              <Button
                onClick={() => handleButtonClick('dealType', '506c')}
                className={`option-button ${dealParams.dealType === '506c' && 'selected'}`}
                variant="outlined"
              >
                506c
              </Button>
            </div>
          </label>
        </FormControl>
        <FormControl className="field">
          <label className="field-label">
            {/* 3(c)(7) */}
            <div className="button-options">
              <Button
                onClick={() =>
                  handleButtonClick(
                    'is3c7',
                    dealParams.is3c7 === null ? true : dealParams.is3c7 === false,
                  )
                }
                className={`option-button ${dealParams.is3c7 === true && 'selected'}`}
                variant="outlined"
              >
                3(c)(7)
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Status
            <div className="button-options">
              <Button
                onClick={() => handleButtonClick('status', 'onboarding')}
                className={`option-button ${status === 'onboarding' && 'selected'}`}
                variant="outlined"
              >
                Onboarding
              </Button>
              <Button
                onClick={() => handleButtonClick('status', 'closed')}
                className={`option-button ${status === 'closed' && 'selected'}`}
                variant="outlined"
              >
                Closed
              </Button>
            </div>
          </label>
        </FormControl>
      </div>
    </section>
  );
}

export default BasicInfoSettings;
