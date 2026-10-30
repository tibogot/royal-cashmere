"use client";

import { useDictionary } from "@/components/LocaleProvider";
import AccountPageSkeleton from "@/components/skeletons/AccountPageSkeleton";

// A client component because loading.tsx gets no params to read the
// language from; the dictionary comes from the layout's LocaleProvider.
export default function AccountLoading() {
  const dict = useDictionary();
  return <AccountPageSkeleton title={dict.shopHeadings.account} />;
}
