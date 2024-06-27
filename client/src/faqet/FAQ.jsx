import React from "react";
import Accordion from "./Accordion";

const FAQ = () => {
  return (
    <div className="container mx-auto p-6 bg-[#7B8E76]">

      {/* About Us Section */}
      <div className="bg-[#A7B1A4] rounded-lg shadow-lg mb-6">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1719433259/Frame_3_edvqpw.svg"
            alt="Bookstore Photo"
            className="h-32 w-32 rounded-l-lg object-cover"
          />
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-[#5a6856] mb-2">Rreth Nesh</h2>
            <p className="text-gray-700">
              Ne jemi një librarie që ofron një koleksion të gjerë të librave për të gjitha moshat dhe shijet. Misioni ynë është të sjellim kulturë dhe dije në komunitetin tonë duke siguruar një zgjedhje të shkëlqyer të librave.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-[#5a6856]">Pyetjet e Bëra Shpesh</h1>

      {/* FAQ Accordion Section */}
      <Accordion
        title="Si mund të bëj një porosi?"
        answer="Për të bërë një porosi, zgjidhni librin që dëshironi dhe klikoni butonin 'Shto në shportë'. Pastaj, shkoni te shporta juaj dhe ndiqni udhëzimet për të përfunduar porosinë."
      />
      <Accordion
        title="Sa kohë merr dorëzimi?"
        answer="Dorëzimi zakonisht merr 1-2 ditë pune brenda Kosovës. Për dorëzime ndërkombëtare, koha mund të jetë më e gjatë."
      />
      <Accordion
        title="A mund të kthej një libër të blerë?"
        answer="Po, mund të ktheni një libër brenda 14 ditëve nga data e blerjes nëse është në gjendje të re dhe i papërdorur. Për më shumë detaje, ju lutemi lexoni politikën tonë të kthimit."
      />
      <Accordion
        title="Si mund të kontaktoj shërbimin e klientit?"
        answer="Ju mund të na kontaktoni përmes faqes së kontaktit."
      />
      <Accordion
        title="A ofroni zbritje për porosi të mëdha?"
        answer="Po, ne ofrojmë zbritje për porosi të mëdha. Ju lutemi na kontaktoni për të diskutuar kushtet dhe zbritjet e mundshme."
      />
      <Accordion
        title="A mund të anuloj një porosi?"
        answer="Po, ju mund të anulloni një porosi para se të jetë dërguar. Kontaktoni shërbimin tonë të klientit për ndihmë të menjëhershme."
      />

    </div>
  );
};

export default FAQ;
