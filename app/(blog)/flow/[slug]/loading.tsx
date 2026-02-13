export default function FlowDetailLoading() {
  return (
    <>
      <div className="p-4 pb-20 animate-pulse">
        {/* 2. STATİK İÇERİK SKELETON (FlowDetailClient Taklidi) */}
        <div className="space-y-6 mb-8">
          {/* Yazar Bloğu Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-neutral-900 rounded" />
              <div className="h-3 w-16 bg-neutral-900 rounded" />
            </div>
          </div>

          {/* Ana Post İçeriği Skeleton */}
          <div className="space-y-3 pl-1">
            <div className="h-7 w-full bg-neutral-900 rounded" />
            <div className="h-7 w-5/6 bg-neutral-900 rounded" />
            <div className="h-7 w-4/6 bg-neutral-900 rounded" />
          </div>

          {/* Tarih Skeleton */}
          <div className="h-4 w-40 bg-neutral-900 rounded" />

          <div className="border-b border-neutral-800 w-full" />
        </div>

        {/* 3. INTERACTIVE SECTION SKELETON (FlowReplySection Taklidi) */}
        <div className="space-y-8">
          {/* Input Alanı Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-48 bg-neutral-900 rounded ml-1" />
            <div className="h-32 w-full bg-neutral-900 rounded-xl border border-neutral-800" />
          </div>

          {/* Yanıtlar Başlığı */}
          <div className="h-6 w-24 bg-neutral-900 rounded border-b border-neutral-800 pb-2" />

          {/* Yanıt Kartları Skeleton Listesi */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-900" />
                    <div className="h-4 w-20 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-3 w-12 bg-neutral-900 rounded" />
                </div>
                <div className="space-y-2 pl-12">
                  <div className="h-4 w-full bg-neutral-900 rounded" />
                  <div className="h-4 w-3/4 bg-neutral-900 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PAGINATION CONTROLS SKELETON */}
      <div className="mt-8 flex justify-center space-x-2 pb-10">
        <div className="h-10 w-10 bg-neutral-900 rounded-lg border border-neutral-800" />
        <div className="h-10 w-10 bg-neutral-900 rounded-lg border border-neutral-800" />
        <div className="h-10 w-10 bg-neutral-900 rounded-lg border border-neutral-800" />
      </div>
    </>
  );
}
