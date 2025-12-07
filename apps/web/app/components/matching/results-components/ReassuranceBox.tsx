'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function ReassuranceBox() {
  const { t } = useTranslation();

  const reassurances = [
    {
      title: t('reassurance.normalToBeNervous'),
      text: t('reassurance.normalToBeNervousDesc'),
    },
    {
      title: t('reassurance.notAlone'),
      text: t('reassurance.notAloneDesc'),
    },
    {
      title: t('reassurance.noObligation'),
      text: t('reassurance.noObligationDesc'),
    },
    {
      title: t('reassurance.chemistryMatters'),
      text: t('reassurance.chemistryMattersDesc'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6 sm:mb-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8"
    >
      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 break-words">
        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-blue-600" />
        <span>{t('reassurance.importantToKnow')}</span>
      </h3>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {reassurances.map((item, index) => (
          <div key={index} className="rounded-xl bg-white/80 p-3 sm:p-4 shadow-sm">
            <h4 className="mb-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
              {item.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 rounded-xl bg-blue-100 border border-blue-200 p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-900 leading-relaxed break-words">
          <strong>{t('reassurance.tipTitle')}</strong> {t('reassurance.tipContent')}
        </p>
      </div>
    </motion.div>
  );
}
