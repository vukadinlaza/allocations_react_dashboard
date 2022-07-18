import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import InputAdornment from '@material-ui/core/InputAdornment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { nWithCommas } from '../../../utils/numbers';
import useStyles from './styles';
import { useAuth } from '../../../auth/useAuth';

function BasicInfoSettings({ formData, setFormData }) {
  const styles = useStyles();
  const { userProfile } = useAuth();
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

  const minimumInvestmentPlaceholder =
    dealParams.minimumInvestment !== null && dealParams.minimumInvestment
      ? nWithCommas(dealParams.minimumInvestment)
      : '1,000';

  return (
    <section className={styles.basicInfoSettings}>
      <h2 className={styles.keyHighlights}>Key highlights</h2>

      <Editor
        className={styles.memoEditor}
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
          file_picker_callback(cb) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
              // eslint-disable-next-line react/no-this-in-sfc
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

      <div className={styles.formFields}>
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Company name
            <TextField
              name="company_name"
              onChange={handleFormChange}
              value={formData.company_name || ''}
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Company description
            <TextField
              name="company_description"
              onChange={handleFormChange}
              value={formData.company_description || ''}
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Target raise
            <TextField
              className={styles.currencyTextField}
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
          </FormLabel>
        </FormControl>

        <FormControl className={`${styles.field} ${styles.fieldButton}`}>
          <FormLabel className={styles.fieldLabel}>
            <div className={styles.buttonOptions}>
              <Button
                onClick={() => handleButtonClick('investmentType', 'spv')}
                className={`${styles.optionButton} ${investmentType === 'spv' && styles.selected}`}
                name="investmentType"
                value="fund"
                variant="outlined"
              >
                SPV
              </Button>
              <Button
                onClick={() => handleButtonClick('investmentType', 'fund')}
                className={`${styles.optionButton} ${investmentType === 'fund' && styles.selected}`}
                name="investmentType"
                value="fund"
                variant="outlined"
              >
                Fund
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Minimum investment
            <CurrencyTextField
              className={styles.currencyTextInput}
              variant="outlined"
              value={dealParams.minimumInvestment}
              placeholder={minimumInvestmentPlaceholder}
              currencySymbol="$"
              textAlign="left"
              name="minimumInvestment"
              outputFormat="string"
              decimalCharacter="."
              decimalPlaces={0}
              digitGroupSeparator=","
              modifyValueOnWheel="false"
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
          </FormLabel>
        </FormControl>

        <FormControl className={`${styles.field} ${styles.fieldButton}`}>
          <FormLabel className={styles.fieldLabel}>
            <div className={styles.buttonOptions}>
              <Button
                onClick={() => handleButtonClick('dealType', '506b')}
                className={`${styles.optionButton} ${
                  dealParams.dealType === '506b' && styles.selected
                }`}
                variant="outlined"
                disabled={!userProfile.admin}
              >
                506b
              </Button>
              <Button
                onClick={() => handleButtonClick('dealType', '506c')}
                className={`${styles.optionButton} ${
                  dealParams.dealType === '506c' && styles.selected
                }`}
                variant="outlined"
                disabled={!userProfile.admin}
              >
                506c
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className={`${styles.field} ${styles.fieldButton}`}>
          <FormLabel className={styles.fieldLabelNarrow}>
            <div className={styles.buttonOptions}>
              <Button
                onClick={() =>
                  handleButtonClick(
                    'is3c7',
                    dealParams.is3c7 === null ? true : dealParams.is3c7 === false,
                  )
                }
                className={`${styles.optionButton} ${dealParams.is3c7 === true && styles.selected}`}
                variant="outlined"
                disabled={!userProfile.admin}
              >
                3(c)(7)
              </Button>
            </div>
          </FormLabel>
        </FormControl>
        <FormControl className={`${styles.fieldButton} ${styles.field}`}>
          <FormLabel className={styles.fieldLabel}>
            <div className={styles.buttonOptions}>
              <Button
                onClick={() => handleButtonClick('status', 'onboarding')}
                className={`${styles.optionButton} ${status === 'onboarding' && styles.selected}`}
                variant="outlined"
              >
                Onboarding
              </Button>
              <Button
                onClick={() => handleButtonClick('status', 'closed')}
                className={`${styles.optionButton} ${status === 'closed' && styles.selected}`}
                variant="outlined"
              >
                Closed
              </Button>
            </div>
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default BasicInfoSettings;
