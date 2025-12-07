'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, Calendar, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function NextStepsGuide() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Phone,
      title: t('nextSteps.viewProfile'),
      description: t('nextSteps.viewProfileDesc'),
    },
    {
      icon: MessageCircle,
      title: t('nextSteps.makeContact'),
      description: t('nextSteps.makeContactDesc'),
    },
    {
      icon: Calendar,
      title: t('nextSteps.scheduleConsultation'),
      description: t('nextSteps.scheduleConsultationDesc'),
    },
    {
      icon: Mail,
      title: t('nextSteps.takeYourTime'),
      description: t('nextSteps.takeYourTimeDesc'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-6 sm:mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 shadow-md"
    >
      <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words">
        {t('nextSteps.whatNow')}
      </h3>
      <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-gray-600 break-words">
        {t('nextSteps.whatNowDesc')}
      </p>

      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-3 sm:gap-4"
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  {t('nextSteps.step', { number: index + 1 })}
                </span>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {step.title}
                </h4>
              </div>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 rounded-xl bg-green-50 border border-green-200 p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-green-800 break-words leading-relaxed">
          <strong>{t('nextSteps.tipTitle')}</strong> {t('nextSteps.tipContent')}
        </p>
      </div>
    </motion.div>
  );
}
