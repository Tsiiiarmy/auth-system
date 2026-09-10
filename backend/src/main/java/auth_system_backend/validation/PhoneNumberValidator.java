package auth_system_backend.validation;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;

public class PhoneNumberValidator {

    private static final PhoneNumberUtil PHONE_UTIL =
            PhoneNumberUtil.getInstance();

    private PhoneNumberValidator() {
    }


    public static String validateAndNormalize(String phoneNumber) {

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Phone number is required"
            );
        }

        try {
            // Remove accidental spaces around the number
            phoneNumber = phoneNumber.trim();

            // Parse international phone number
            Phonenumber.PhoneNumber parsedNumber =
                    PHONE_UTIL.parse(phoneNumber, "ET");

            // Check whether the number is valid
            if (!PHONE_UTIL.isValidNumber(parsedNumber)) {
                throw new IllegalArgumentException(
                        "Invalid phone number"
                );
            }

            // Always store/return in international E.164 format
            return PHONE_UTIL.format(
                    parsedNumber,
                    PhoneNumberUtil.PhoneNumberFormat.E164
            );

        } catch (NumberParseException e) {
            throw new IllegalArgumentException(
                    "Invalid phone number format"
            );
        }
    }


}