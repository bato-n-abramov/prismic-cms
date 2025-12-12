"use client";
import useSiteAnimations from "@/hooks/useSiteAnimations";
import { useMemo, useCallback, useRef, useState } from "react";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import "./contact.scss";

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Too short").required("Required"),
  email: Yup.string().trim().email("Invalid email").required("Required"),
  company: Yup.string().trim().nullable().required("Required"),
  budget: Yup.string().trim().nullable().required("Required"),
  date: Yup.string().trim().required("Required"),
  details: Yup.string().trim(),
  consent: Yup.boolean().oneOf([true], "Required"),
});

const Contact = ({ slice }) => {
  const { pretitle, title, text } = slice.primary;

  const rootRef = useRef(null);

  useSiteAnimations(rootRef);

  const MAX_DATES = 3;
  const [dateMsg, setDateMsg] = useState(false);
  const hideTimeoutRef = useRef(null);

  const showDateMessage = useCallback(() => {
    setDateMsg(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setDateMsg(false), 3000);
  }, []);

  const formatDates = useCallback((selectedDates = []) => {
    const pad = (n) => String(n).padStart(2, "0");
    return selectedDates
      .map((d) => {
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
      })
      .join(", ");
  }, []);

  const fpBaseOptions = useMemo(
    () => ({
      mode: "multiple",
      dateFormat: "Y-m-d H:i",
      enableTime: true,
      minDate: "today",
      locale: "en",
      closeOnSelect: false,
    }),
    []
  );

  const onFpReady = useCallback((_sel, _str, instance) => {
    instance.calendarContainer?.classList.add("contact-datepicker");
  }, []);

  const onFpOpen = useCallback((_sel, _str, instance) => {
    instance.calendarContainer?.classList.add("contact-datepicker");
  }, []);

  const fpOptions = useMemo(
    () => ({
      ...fpBaseOptions,
      onReady: onFpReady,
      onOpen: onFpOpen,
    }),
    [fpBaseOptions, onFpReady, onFpOpen]
  );

  const makeOnDateChange = useCallback(
    (setFieldValue) => (selectedDates, _dateStr, instance) => {
      if (selectedDates.length > MAX_DATES) {
        const trimmed = selectedDates.slice(0, MAX_DATES);
        instance.setDate(trimmed, false);
        showDateMessage();
        setTimeout(() => instance.open(), 0);
        setFieldValue("date", formatDates(trimmed));
        return;
      }

      setFieldValue("date", formatDates(selectedDates));
    },
    [MAX_DATES, formatDates, showDateMessage]
  );


  return (
    <section
      ref={rootRef}
      className="site-section contact"
      id="contact"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        <div className="site-section__inner contact__inner">
          <div className="contact__info">
            {pretitle && (
              <div className="site-text pretitle contact__pretitle site-animation fade-up">{pretitle}</div>
            )}

            {title && (
              <div className="h2 site-title contact__title site-animation fade-up" data-delay="200">
                <PrismicRichText field={title} />
              </div>
            )}

            {text && <div className="site-text big contact__text site-animation fade-up" data-delay="300">{text}</div>}
          </div>

          <div className="contact__form-wrapper site-animation fade-up" data-delay="400">
            <Formik
              initialValues={{
                name: "",
                email: "",
                company: "",
                budget: "",
                date: "",
                details: "",
                consent: false,
              }}
              validationSchema={schema}
              onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                setStatus(null);

                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  });

                  const data = await res.json().catch(() => ({}));

                  if (!res.ok || data.ok !== true) {
                    throw new Error(data?.message || "Request failed");
                  }

                  resetForm();
                  setStatus({ ok: true });
                } catch (e) {
                  setStatus({ ok: false });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ setFieldValue, isSubmitting, status }) => {

                return (
                  <Form className="form" noValidate>
                    {/* row 1 */}
                    <div className="form__row">
                      <div className="form__col">
                        <Field
                          className="form__input"
                          name="name"
                          placeholder="Name*"
                          type="text"
                        />
                        <ErrorMessage name="name" component="div" className="contact__error" />
                      </div>

                      <div className="form__col">
                        <Field
                          className="form__input"
                          name="email"
                          placeholder="Email*"
                          type="email"
                        />
                        <ErrorMessage name="email" component="div" className="contact__error" />
                      </div>
                    </div>

                    {/* row 2 */}
                    <div className="form__row">
                      <div className="form__col">
                        <Field
                          className="form__input"
                          name="company"
                          placeholder="Company"
                          type="text"
                        />
                        <ErrorMessage name="company" component="div" className="contact__error" />
                      </div>

                      <div className="form__col">
                        <Field
                          className="form__input"
                          name="budget"
                          placeholder="Budget"
                          type="text"
                        />
                        <ErrorMessage name="budget" component="div" className="contact__error" />
                      </div>
                    </div>

                    {/* row 3 */}
                    <div className="form__row">
                      <div className="form__col">
                        <Flatpickr
                          options={fpOptions}
                          onChange={makeOnDateChange(setFieldValue)}
                          render={({ defaultValue }, ref) => (
                            <input
                              ref={ref}
                              defaultValue={defaultValue}
                              className="form__input date__input"
                              placeholder="Choose dates"
                              readOnly
                              id="multi-dates"
                            />
                          )}
                        />

                        {dateMsg && (
                          <div className="multi-date-message">
                            You can select up to {MAX_DATES} dates only
                          </div>
                        )}

                        <ErrorMessage name="date" component="div" className="contact__error" />
                      </div>
                    </div>

                    {/* row 4 */}
                    <div className="form__row">
                      <div className="form__col">
                        <Field
                          as="textarea"
                          className="form__input"
                          name="details"
                          placeholder="How can we help you!"
                        />
                        <ErrorMessage name="details" component="div" className="contact__error" />
                      </div>
                    </div>

                    {/* row 5 */}
                    <div className="form__row">
                      <div className="form__col">
                        <label className="form__acceptance">
                          <Field type="checkbox" name="consent" />
                          <span>
                            I agree with the{" "}
                            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        <ErrorMessage name="consent" component="div" className="contact__error" />
                      </div>
                    </div>

                    {/* row 6 */}
                    <div className="form__row">
                      <div className="form__col">
                        <div className="form__submit-wrapper site-button primary white">
                          <button className="form__submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Let’s Talk"}
                          </button>
                        </div>

                        {status?.ok === true && (
                          <div className="contact__status contact__status--success">Thank you!</div>
                        )}
                        {status?.ok === false && (
                          <div className="contact__status contact__status--error">Error. Try again.</div>
                        )}
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>

            <div className="contact__lines">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
