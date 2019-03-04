import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

import { Address } from './Address';
import { Country } from './Country';
import { InternationalAddress } from './InternationalAddress';

export const ContactSecondary = connect(
  {
    parentView: props.parentView,
    bind: props.bind,
    data: state[props.bind],
    constants: state.constants,
    onChange: props.onChange,
    onChangeSequence: sequences[props.onChange],
    validationErrors: state.validationErrors,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    contactsHelper: state[props.contactsHelper],
  },
  ({
    parentView,
    bind,
    data,
    constants,
    onChange,
    onChangeSequence,
    validationErrors,
    onBlur,
    onBlurSequence,
    contactsHelper,
  }) => {
    return (
      <div className="usa-form-group contact-group">
        {parentView === 'CaseDetail' ? (
          <h4>{contactsHelper.contactSecondary.header}</h4>
        ) : (
          <h3>{contactsHelper.contactSecondary.header}</h3>
        )}
        <div className="blue-container">
          <Country
            type="contactSecondary"
            bind={bind}
            onChange={onChange}
            onBlur={onBlur}
          />
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactSecondary &&
              validationErrors.contactSecondary.name
                ? 'usa-input-error'
                : '')
            }
          >
            <label htmlFor="secondaryName">
              {contactsHelper.contactSecondary.nameLabel}
            </label>
            <input
              id="secondaryName"
              type="text"
              name="contactSecondary.name"
              autoCapitalize="none"
              value={data.contactSecondary.name || ''}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                onBlurSequence();
              }}
            />
            <div className="usa-input-error-message beneath">
              {validationErrors.contactSecondary &&
                validationErrors.contactSecondary.name}
            </div>
          </div>
          {contactsHelper.contactSecondary.displayInCareOf && (
            <div className="usa-form-group">
              <label htmlFor="secondaryInCareOf">
                {contactsHelper.contactSecondary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactSecondary.inCareOfLabel}{' '}
                    {contactsHelper.contactSecondary.inCareOfLabelHint && (
                      <span className="usa-form-hint">
                        ({contactsHelper.contactSecondary.inCareOfLabelHint})
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    In Care Of <span className="usa-form-hint">(optional)</span>
                  </span>
                )}
              </label>
              <input
                id="secondaryInCareOf"
                type="text"
                name="contactSecondary.inCareOf"
                autoCapitalize="none"
                value={data.contactSecondary.inCareOf || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  onBlurSequence();
                }}
              />
              {validationErrors.contactSecondary && (
                <div className="usa-input-error-message beneath">
                  {validationErrors.contactSecondary.inCareOf}
                </div>
              )}
            </div>
          )}
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              type="contactSecondary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              type="contactSecondary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {contactsHelper.contactSecondary.displayPhone && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary &&
                validationErrors.contactSecondary.phone
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryPhone">Phone Number</label>
              <input
                id="secondaryPhone"
                type="tel"
                name="contactSecondary.phone"
                className="ustc-input-phone"
                autoCapitalize="none"
                value={data.contactSecondary.phone || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  onBlurSequence();
                }}
              />
              <div className="usa-input-error-message beneath">
                {validationErrors.contactSecondary &&
                  validationErrors.contactSecondary.phone}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
