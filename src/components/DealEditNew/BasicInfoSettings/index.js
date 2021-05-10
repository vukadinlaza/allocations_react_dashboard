import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import './styles.scss'
import { FormControl, TextField, Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

function BasicInfoSettings() {
  return (
    <section className="BasicInfoSettings">
      <h2>Key highlights</h2>

      <Editor
        value={'hello world'}
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
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                var id = 'blobid' + (new Date()).getTime();
                var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(',')[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}
        onEditorChange={(value) => {
          console.log('edit change', value)
        }}
      />

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Company name
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Company description
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Target raise
            <CurrencyTextField
              className="currency-text-input"
              variant="outlined"
              // value={amount}
              currencySymbol="$"
              textAlign="left"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => console.log(value.toString())}
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Deal type
            <div className="button-options">
              <Button
                className="option-button"
                variant="outlined">
                SPV
              </Button>
              <Button
                className="option-button"
                variant="outlined">
                Fund
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Minumum investment
            <CurrencyTextField
              className="currency-text-input"
              variant="outlined"
              // value={amount}
              currencySymbol="$"
              textAlign="left"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => console.log(value.toString())}
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Deal type
            <div className="button-options">
              <Button
                className="option-button"
                variant="outlined">
                506b
              </Button>
              <Button
                className="option-button"
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
                className="option-button"
                variant="outlined">
                Onboarding
              </Button>
              <Button
                className="option-button"
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
