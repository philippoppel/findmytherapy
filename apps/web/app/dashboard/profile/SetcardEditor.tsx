'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, FormField, Input, Textarea } from '@mental-health/ui';
import { Loader2 } from 'lucide-react';
import {
  setcardPayloadSchema,
  splitToList,
  parseCurrencyInput,
  formatCurrencyInput,
} from '@/lib/therapist/setcard';
import type { SetcardPayload } from '@/lib/therapist/setcard';
import { useTranslation } from '@/lib/i18n';

type SetcardFormValues = {
  displayName: string;
  title: string;
  headline: string;
  profileImageUrl: string;
  videoUrl: string;
  acceptingClients: boolean;
  online: boolean;
  services: string;
  specialties: string;
  modalities: string;
  languages: string;
  approachSummary: string;
  experienceSummary: string;
  responseTime: string;
  availabilityNote: string;
  pricingNote: string;
  about: string;
  city: string;
  country: string;
  priceMin: string;
  priceMax: string;
  yearsExperience: string;
  // Gallery
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
  galleryImage4: string;
  galleryImage5: string;
  // Social Media
  socialLinkedin: string;
  socialInstagram: string;
  socialFacebook: string;
  websiteUrl: string;
  // Additional Info
  qualifications: string;
  ageGroups: string;
  acceptedInsurance: string;
  privatePractice: boolean;
};

type SetcardEditorProps = {
  initialValues: SetcardFormValues;
  onSuccessfulUpdate?: (payload: SetcardPayload) => void;
};

const toPayload = (values: SetcardFormValues): SetcardPayload => {
  const services = splitToList(values.services);
  const specialties = splitToList(values.specialties);
  const modalities = splitToList(values.modalities);
  const languages = splitToList(values.languages);
  const qualifications = splitToList(values.qualifications);
  const ageGroups = splitToList(values.ageGroups);
  const acceptedInsurance = splitToList(values.acceptedInsurance);
  const parsedYears = values.yearsExperience ? Number.parseInt(values.yearsExperience, 10) : NaN;

  // Collect non-empty gallery images
  const galleryImages = [
    values.galleryImage1,
    values.galleryImage2,
    values.galleryImage3,
    values.galleryImage4,
    values.galleryImage5,
  ]
    .map((url) => url?.trim())
    .filter((url) => url && url.length > 0);

  return {
    displayName: values.displayName.trim(),
    title: values.title.trim(),
    headline: values.headline.trim(),
    approachSummary: values.approachSummary.trim(),
    experienceSummary: values.experienceSummary.trim(),
    services,
    profileImageUrl: values.profileImageUrl ? values.profileImageUrl.trim() : null,
    videoUrl: values.videoUrl ? values.videoUrl.trim() : null,
    acceptingClients: values.acceptingClients,
    yearsExperience: Number.isNaN(parsedYears) ? null : parsedYears,
    responseTime: values.responseTime ? values.responseTime.trim() : null,
    modalities,
    specialties,
    languages,
    priceMin: parseCurrencyInput(values.priceMin),
    priceMax: parseCurrencyInput(values.priceMax),
    availabilityNote: values.availabilityNote ? values.availabilityNote.trim() : null,
    pricingNote: values.pricingNote ? values.pricingNote.trim() : null,
    about: values.about ? values.about.trim() : null,
    city: values.city ? values.city.trim() : null,
    country: values.country ? values.country.trim().toUpperCase() : null,
    online: values.online,
    // Gallery
    galleryImages,
    // Social Media
    socialLinkedin: values.socialLinkedin ? values.socialLinkedin.trim() : null,
    socialInstagram: values.socialInstagram ? values.socialInstagram.trim() : null,
    socialFacebook: values.socialFacebook ? values.socialFacebook.trim() : null,
    websiteUrl: values.websiteUrl ? values.websiteUrl.trim() : null,
    // Additional Info
    qualifications,
    ageGroups,
    acceptedInsurance,
    privatePractice: values.privatePractice,
  };
};

const mapPayloadToFormValues = (payload: SetcardPayload): SetcardFormValues => ({
  displayName: payload.displayName,
  title: payload.title,
  headline: payload.headline,
  profileImageUrl: payload.profileImageUrl ?? '',
  videoUrl: payload.videoUrl ?? '',
  acceptingClients: payload.acceptingClients,
  online: payload.online,
  services: payload.services.join('\n'),
  specialties: payload.specialties.join('\n'),
  modalities: payload.modalities.join('\n'),
  languages: payload.languages.join('\n'),
  approachSummary: payload.approachSummary,
  experienceSummary: payload.experienceSummary,
  responseTime: payload.responseTime ?? '',
  availabilityNote: payload.availabilityNote ?? '',
  pricingNote: payload.pricingNote ?? '',
  about: payload.about ?? '',
  city: payload.city ?? '',
  country: payload.country ?? '',
  priceMin: formatCurrencyInput(payload.priceMin),
  priceMax: formatCurrencyInput(payload.priceMax),
  yearsExperience:
    typeof payload.yearsExperience === 'number' ? String(payload.yearsExperience) : '',
  // Gallery
  galleryImage1: payload.galleryImages?.[0] ?? '',
  galleryImage2: payload.galleryImages?.[1] ?? '',
  galleryImage3: payload.galleryImages?.[2] ?? '',
  galleryImage4: payload.galleryImages?.[3] ?? '',
  galleryImage5: payload.galleryImages?.[4] ?? '',
  // Social Media
  socialLinkedin: payload.socialLinkedin ?? '',
  socialInstagram: payload.socialInstagram ?? '',
  socialFacebook: payload.socialFacebook ?? '',
  websiteUrl: payload.websiteUrl ?? '',
  // Additional Info
  qualifications: payload.qualifications?.join('\n') ?? '',
  ageGroups: payload.ageGroups?.join('\n') ?? '',
  acceptedInsurance: payload.acceptedInsurance?.join('\n') ?? '',
  privatePractice: payload.privatePractice ?? false,
});

export function SetcardEditor({ initialValues, onSuccessfulUpdate }: SetcardEditorProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    setError,
    clearErrors,
  } = useForm<SetcardFormValues>({
    defaultValues: initialValues,
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (values: SetcardFormValues) => {
    clearErrors();
    setErrorMessage(null);

    const payload = toPayload(values);
    const validation = setcardPayloadSchema.safeParse(payload);

    if (!validation.success) {
      setStatus('error');
      const firstIssue = validation.error.issues[0];
      if (firstIssue?.path?.length) {
        const field = firstIssue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof SetcardFormValues, {
            type: 'manual',
            message: firstIssue.message,
          });
        }
      }
      setErrorMessage(t('profileEditor.checkInputs'));
      return;
    }

    try {
      setStatus('saving');
      const response = await fetch('/api/therapist/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus('error');
        setErrorMessage(result.message ?? t('profileEditor.couldNotSave'));
        return;
      }

      const updatedFormValues = mapPayloadToFormValues(validation.data);
      reset(updatedFormValues);
      setStatus('success');

      if (onSuccessfulUpdate) {
        onSuccessfulUpdate(validation.data);
      }
    } catch (error) {
      console.error('Failed to update setcard', error);
      setStatus('error');
      setErrorMessage(t('profileEditor.errorSaving'));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Sticky Header mit Speichern-Button */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-6 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-neutral-900">{t('profileEditor.editProfile')}</h2>
            <p className="text-sm text-muted mt-1">
              {t('profileEditor.updatePublicSetcard')}
            </p>
          </div>
          <Button type="submit" disabled={status === 'saving' || !isDirty} className="shrink-0">
            {status === 'saving' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                {t('profileEditor.saving')}
              </>
            ) : (
              t('profileEditor.saveChanges')
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-3">
            <Alert
              variant="success"
              title={t('profileEditor.savedSuccess')}
              description={t('profileEditor.changesSaved')}
            />
          </div>
        )}
        {status === 'error' && errorMessage && (
          <div className="mt-3">
            <Alert variant="danger" title={t('profileEditor.errorSavingTitle')} description={errorMessage} />
          </div>
        )}
      </div>

      {/* Öffentliche Darstellung */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.publicPresentation')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.howYouAppear')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="displayName" label={t('profileEditor.displayedName')} required>
            <Input {...register('displayName')} placeholder={t('profileEditor.displayedNamePlaceholder')} />
          </FormField>
          <FormField id="title" label={t('profileEditor.title')} required>
            <Input
              {...register('title')}
              placeholder={t('profileEditor.titleExtendedPlaceholder')}
            />
          </FormField>
          <FormField
            id="headline"
            label={t('profileEditor.headline')}
            required
            helperText={t('profileEditor.headlineHelper')}
          >
            <Input
              {...register('headline')}
              placeholder={t('profileEditor.headlinePlaceholder')}
            />
          </FormField>
          <FormField
            id="profileImageUrl"
            label={t('profileEditor.profileImage')}
            helperText={t('profileEditor.profileImageHelper')}
          >
            <Input
              {...register('profileImageUrl')}
              placeholder={t('profileEditor.profileImagePlaceholder')}
            />
          </FormField>
          <FormField
            id="videoUrl"
            label={t('profileEditor.videoLabel')}
            helperText={t('profileEditor.videoHelper')}
          >
            <Input {...register('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
          </FormField>
          <FormField
            id="responseTime"
            label={t('profileEditor.responseTime')}
            helperText={t('profileEditor.responseTimeHelper')}
          >
            <Input {...register('responseTime')} placeholder={t('profileEditor.responseTimePlaceholder')} />
          </FormField>
        </div>
      </section>

      {/* Galerie */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.gallery')}</h3>
            <p className="text-sm text-muted">
              {t('profileEditor.galleryDescription')}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            id="galleryImage1"
            label={t('profileEditor.galleryImage1')}
            helperText={t('profileEditor.galleryImageFullHelper')}
          >
            <Input {...register('galleryImage1')} placeholder="/images/praxis-empfang.jpg" />
          </FormField>
          <FormField id="galleryImage2" label={t('profileEditor.galleryImage2')} helperText={t('profileEditor.optional')}>
            <Input {...register('galleryImage2')} placeholder="/images/praxis-raum.jpg" />
          </FormField>
          <FormField id="galleryImage3" label={t('profileEditor.galleryImage3')} helperText={t('profileEditor.optional')}>
            <Input {...register('galleryImage3')} placeholder="/images/praxis-wartebereich.jpg" />
          </FormField>
          <FormField id="galleryImage4" label={t('profileEditor.galleryImage4')} helperText={t('profileEditor.optional')}>
            <Input {...register('galleryImage4')} placeholder="/images/praxis-aussenansicht.jpg" />
          </FormField>
          <FormField id="galleryImage5" label={t('profileEditor.galleryImage5')} helperText={t('profileEditor.optional')}>
            <Input {...register('galleryImage5')} placeholder="/images/team.jpg" />
          </FormField>
        </div>
      </section>

      {/* Social Media & Web */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.socialMediaSection')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.socialMediaDescription')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="websiteUrl"
            label={t('profileEditor.website')}
            helperText={t('profileEditor.websiteHelper')}
          >
            <Input {...register('websiteUrl')} placeholder={t('profileEditor.websitePlaceholder')} type="url" />
          </FormField>
          <FormField
            id="socialLinkedin"
            label={t('profileEditor.linkedin')}
            helperText={t('profileEditor.linkedinHelper')}
          >
            <Input
              {...register('socialLinkedin')}
              placeholder="https://linkedin.com/in/..."
              type="url"
            />
          </FormField>
          <FormField
            id="socialInstagram"
            label={t('profileEditor.instagram')}
            helperText={t('profileEditor.instagramHelper')}
          >
            <Input
              {...register('socialInstagram')}
              placeholder="https://instagram.com/..."
              type="url"
            />
          </FormField>
          <FormField
            id="socialFacebook"
            label={t('profileEditor.facebook')}
            helperText={t('profileEditor.facebookHelper')}
          >
            <Input
              {...register('socialFacebook')}
              placeholder="https://facebook.com/..."
              type="url"
            />
          </FormField>
        </div>
      </section>

      {/* Beschreibung */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.descriptionSection')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.descriptionSectionDesc')}</p>
          </div>
        </div>
        <FormField
          id="approachSummary"
          label={t('profileEditor.approach')}
          required
          helperText={t('profileEditor.approachHelper')}
        >
          <Textarea rows={4} {...register('approachSummary')} />
        </FormField>
        <FormField
          id="experienceSummary"
          label={t('profileEditor.experience')}
          required
          helperText={t('profileEditor.experienceHelper')}
        >
          <Textarea rows={3} {...register('experienceSummary')} />
        </FormField>
        <FormField id="about" label={t('profileEditor.aboutMe')}>
          <Textarea rows={5} {...register('about')} />
        </FormField>
      </section>

      {/* Angebot & Formate */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.offerSection')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.offerSectionDesc')}</p>
          </div>
        </div>
        <FormField
          id="services"
          label={t('profileEditor.services')}
          required
          helperText={t('profileEditor.servicesHelperFull')}
        >
          <Textarea rows={3} {...register('services')} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="specialties"
            label={t('profileEditor.specialties')}
            required
            helperText={t('profileEditor.specialtiesHelperFull')}
          >
            <Textarea rows={3} {...register('specialties')} />
          </FormField>
          <FormField
            id="modalities"
            label={t('profileEditor.modalities')}
            required
            helperText={t('profileEditor.modalitiesHelper')}
          >
            <Textarea rows={3} {...register('modalities')} />
          </FormField>
        </div>
        <FormField id="languages" label={t('profileEditor.languages')} required helperText={t('profileEditor.languagesHelper')}>
          <Textarea rows={2} {...register('languages')} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="availabilityNote" label={t('profileEditor.availability')}>
            <Textarea rows={2} {...register('availabilityNote')} />
          </FormField>
          <FormField id="pricingNote" label={t('profileEditor.pricingNote')}>
            <Textarea rows={2} {...register('pricingNote')} />
          </FormField>
        </div>
      </section>

      {/* Qualifikationen & Zielgruppen */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.qualificationsSection')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.qualificationsSectionDesc')}</p>
          </div>
        </div>
        <FormField
          id="qualifications"
          label={t('profileEditor.qualifications')}
          helperText={t('profileEditor.qualificationsHelperFull')}
        >
          <Textarea
            rows={4}
            {...register('qualifications')}
            placeholder={t('profileEditor.qualificationsPlaceholder')}
          />
        </FormField>
        <FormField
          id="ageGroups"
          label={t('profileEditor.ageGroups')}
          helperText={t('profileEditor.ageGroupsHelper')}
        >
          <Textarea
            rows={3}
            {...register('ageGroups')}
            placeholder={t('profileEditor.ageGroupsPlaceholder')}
          />
        </FormField>
        <FormField
          id="acceptedInsurance"
          label={t('profileEditor.acceptedInsurance')}
          helperText={t('profileEditor.acceptedInsuranceHelper')}
        >
          <Textarea
            rows={3}
            {...register('acceptedInsurance')}
            placeholder={t('profileEditor.acceptedInsurancePlaceholder')}
          />
        </FormField>
        <label className="flex items-center gap-3 rounded-lg border border-divider bg-surface-1 px-4 py-3 text-sm font-medium text-default">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
            {...register('privatePractice')}
          />
          {t('profileEditor.privatePractice')}
        </label>
      </section>

      {/* Rahmendaten */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{t('profileEditor.frameworkSection')}</h3>
            <p className="text-sm text-muted">{t('profileEditor.frameworkSectionDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="city" label={t('profileEditor.location')}>
            <Input {...register('city')} placeholder={t('profileEditor.cityPlaceholder')} />
          </FormField>
          <FormField id="country" label={t('profileEditor.country')} helperText={t('profileEditor.countryHelper')}>
            <Input {...register('country')} placeholder={t('profileEditor.countryPlaceholder')} />
          </FormField>
          <FormField id="priceMin" label={t('profileEditor.priceMin')}>
            <Input type="number" step="1" min="0" {...register('priceMin')} placeholder="80" />
          </FormField>
          <FormField id="priceMax" label={t('profileEditor.priceMax')}>
            <Input type="number" step="1" min="0" {...register('priceMax')} placeholder="120" />
          </FormField>
          <FormField id="yearsExperience" label={t('profileEditor.yearsExperience')}>
            <Input
              type="number"
              min="0"
              max="60"
              {...register('yearsExperience')}
              placeholder="8"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-divider bg-surface-1 px-4 py-3 text-sm font-medium text-default">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
              {...register('acceptingClients')}
            />
            {t('profileEditor.acceptingClients')}
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-divider bg-surface-1 px-4 py-3 text-sm font-medium text-default">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
              {...register('online')}
            />
            {t('profileEditor.offersOnline')}
          </label>
        </div>
      </section>

      {/* Zusätzlicher Speichern-Button am Ende (optional für lange Formulare) */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button type="submit" disabled={status === 'saving' || !isDirty}>
          {status === 'saving' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              {t('profileEditor.saving')}
            </>
          ) : (
            t('profileEditor.saveChanges')
          )}
        </Button>
      </div>
    </form>
  );
}

export type { SetcardFormValues };
