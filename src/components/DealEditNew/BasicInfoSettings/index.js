import React, { useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import './styles.scss'
import { FormControl, TextField, Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import InputAdornment from '@material-ui/core/InputAdornment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';


function BasicInfoSettings({ formData, setFormData }) {

  const handleFormChange = (field, value) => {

    console.log('in form change', field, value)
    const dealParamFields = ['dealType', 'minimumInvestment', 'target']

    if (dealParamFields.includes(field)) {
      return setFormData(prevState => ({
        ...prevState,
        dealParams: {
          ...prevState.dealParams,
          [field]: value
        }
      }))
    }

    return setFormData(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  const {
    investmentType,
    status,
    dealParams
  } = formData;

  return (
    <section className="BasicInfoSettings">
      <h2>Key highlights</h2>

      <Editor
        value={formData.memo}
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
            'undo redo | formatselect | bold italic backcolor image | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
          file_picker_types: 'image',
          file_picker_callback: function(cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function() {
              var file = this.files[0];

              var reader = new FileReader();
              reader.onload = function() {

                var id = 'blobid' + (new Date()).getTime();
                var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(',')[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}
        onEditorChange={(value) => {
          setFormData(prevData => ({
            ...prevData,
            memo: value
          }))
        }}
      />

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Company name
            <TextField
              value={formData.company_name}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Company description
            <TextField
              value={formData.company_description}
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
              value={formData.target}
              onChange={({ target }) => handleFormChange('target', target.value)}
              variant='outlined'
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
                onClick={() => handleFormChange('investmentType', 'spv')}
                className={`option-button ${investmentType === 'spv' && 'selected'}`}
                variant="outlined">
                SPV
              </Button>
              <Button
                onClick={() => handleFormChange('investmentType', 'fund')}
                className={`option-button ${investmentType === 'fund' && 'selected'}`}
                variant="outlined">
                Fund
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Minumum investment

            <TextField
              onChange={({ target }) => handleFormChange('minimumInvestment', target.value)}
              className="currency-text-input"
              value={dealParams.minimumInvestment}
              variant='outlined'
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
                onClick={() => handleFormChange('dealType', '506b')}
                className={`option-button ${dealParams.dealType === '506b' && 'selected'}`}
                variant="outlined">
                506b
              </Button>
              <Button
                onClick={() => handleFormChange('dealType', '506c')}
                className={`option-button ${dealParams.dealType === '506c' && 'selected'}`}
                variant="outlined">
                506c
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Status
            <div className="button-options">
              <Button
                onClick={() => handleFormChange('status', 'onboarding')}
                className={`option-button ${status === 'onboarding' && 'selected'}`}
                variant="outlined">
                Onboarding
              </Button>
              <Button
                onClick={() => handleFormChange('status', 'closed')}
                className={`option-button ${status === 'closed' && 'selected'}`}
                variant="outlined">
                Closed
              </Button>
            </div>
          </label>
        </FormControl>

      </div>


    </section>
  )
}

export default BasicInfoSettings
