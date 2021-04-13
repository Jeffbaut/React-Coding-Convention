import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MyDropzone } from "components/app/dropzone";

import { componentMapper, componentTypes } from "components/forms-tailwind-component-mapper";

const INSERT_PRODUCT = gql`
  mutation insertProduct($product: product_insert_input!) {
    insert_product_one(object: $product) {
      id
    }
  }
`;

const INSERT_PICTURES = gql`
  mutation insertPictures($pictures: [picture_insert_input!]!) {
    insert_picture(objects: $pictures) {
      returning {
        id
      }
    }
  }
`;

// {
//   "code": "1",
//   "additionalCode": "",
//   "name": "Akuankka muokattu",
//   "price": 12,
//   "department": 0,
//   "group": 260,
//   "subgroup": 0,
//   "webShop": false,
//   "weight": 0,
//   "vatClass": 0,
//   "description": "# Otsikko tähän\n\nEntteri Uutta tekstiä. ![null](<kuva.jpg> =100x80)Sen jä lkeen laitetaan **lihavointi** ja sit *alleviivaus* Ihan normaali teksti. Katotaan miten käy.\n\n",
//   "webShopName": "Teesti",
//   "conditionId": null,
//   "colorId": null,
//   "bookLanguageId": null,
//   "womenSizeId": null,
//   "menSizeId": null,
//   "jeansSizeId": null,
//   "shoeSizeId": null,
//   "kidsSizeId": null,
//   "stockQty": null,
//   "modifiedAt": "2021-03-04T11:29:17.000Z"
// }

const yupSchema = yup.object().shape({
  name: yup.string().required("Tuotteella pitää olla nimi"),
  price: yup.number().typeError("Hinta pitää määrittää").required("Hinta pitää määrittää"),
  vat_class: yup.number().typeError("Valitse veroluokka").required("Valitse veroluokka"),
  description: yup.string(),
  photos: yup.array().of(
    yup.object().shape({
      url: yup.string(),
    })
  ),
});

export interface AddProductFormValues {
  name: string;
  price: number;
  vat_class: number;
  description?: string;
  photos: Array<{ url: string }>;
  condition: string;
  "Kirjan kieli": string;
  "Naisten kokotaulukko": string;
  "Miesten kokotaulukko": string;
  "Farkkujen koko": string;
  "Kenkien koot": number;
  "Lasten vaatteet": string;
  Paino: number;
  Varasto: string;
  Ympäristösäästö: string;
  Passiivinen: boolean;
  Hyllypaikka: string;
  heading: string;
}

export interface AddProductField {
  name: keyof AddProductFormValues;
  label: string;
  type: componentTypes;
  input?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  textarea?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
  select?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
  arrayComponent?: componentTypes;
  isRequired?: boolean;
  description?: string;
  options?: Array<{ label: string; value: number | string }>;
  cols?: number;
  spaceBefore?: number;
  spaceAfter?: number;
}

const schema: Array<AddProductField> = [
  {
    name: "name",
    type: componentTypes.TEXT_FIELD,
    label: "Tuotteen nimi",
    isRequired: true,
    cols: 3,
    spaceAfter: 3,
  },
  {
    name: "price",
    type: componentTypes.PRICE,
    label: "Hinta",
    isRequired: true,
    cols: 2,
  },
  {
    name: "vat_class",
    type: componentTypes.SELECT,
    label: "Veroluokka",
    isRequired: true,
    cols: 2,
    spaceAfter: 1,
    options: [
      { label: "0%", value: 0 },
      { label: "24%", value: 24 },
    ],
  },
  {
    name: "description",
    type: componentTypes.MARKDOWN,
    description: "Markdown kuvaus",
    label: "Kuvaus",
  },
  {
    name: "photos",
    type: componentTypes.FIELD_ARRAY,
    description: "Tuotekuvat",
    label: "Kuvat",
    arrayComponent: componentTypes.TEXT_FIELD,
  },
  {
    name: "condition",
    type: componentTypes.SELECT,
    label: "Kuntoluokitus",
    cols: 2,
    spaceAfter: 1,
    options: [
      { label: "Täysin uusi", value: "Täysin uusi" },
      { label: "Lähes käyttämätön", value: "Lähes käyttämätön" },
      { label: "Hyvä", value: "Hyvä" },
      { label: "Tyydyttävä", value: "Tyydyttävä" },
      { label: "Ei kuntoluokitusta", value: "Ei kuntoluokitusta" },
    ],
  },
  {
    name: "Kirjan kieli",
    type: componentTypes.SELECT,
    label: "Kirjan kieli",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "Suomi",
        value: "Suomi",
      },
      {
        label: "Ruotsi",
        value: "Ruotsi",
      },
      {
        label: "Englanti",
        value: "Englanti",
      },
      {
        label: "Muut kielet",
        value: "Muut kielet",
      },
    ],
  },
  {
    name: "heading",
    type: componentTypes.HEADING,
    label: "Koot",
    description: "Tuotteiden kokovalinnat",
    cols: 6,
  },
  {
    name: "Naisten kokotaulukko",
    type: componentTypes.SELECT,
    label: "Naisten kokotaulukko",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "XXS - 32",
        value: "XXS - 32",
      },
      {
        label: "XS - 34",
        value: "XS - 34",
      },
      {
        label: "S - 36",
        value: "S - 36",
      },
      {
        label: "M - 38",
        value: "M - 38",
      },
      {
        label: "L - 40",
        value: "L - 40",
      },
      {
        label: "XL - 42",
        value: "XL - 42",
      },
      {
        label: "XXL - 44",
        value: "XXL - 44",
      },
      {
        label: "XXXL - 46",
        value: "XXXL - 46",
      },
      {
        label: "XXXXL - 48",
        value: "XXXXL - 48",
      },
      {
        label: "XXXXXL - 50",
        value: "XXXXXL - 50",
      },
      {
        label: "One size",
        value: "One size",
      },
    ],
  },
  {
    name: "Miesten kokotaulukko",
    type: componentTypes.SELECT,
    label: "Miesten kokotaulukko",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "XS (miehet) 40-42",
        value: "XS (miehet) 40-42",
      },
      {
        label: "S 44-46",
        value: "S 44-46",
      },
      {
        label: "M 48-50",
        value: "M 48-50",
      },
      {
        label: "L 52-54",
        value: "L 52-54",
      },
      {
        label: "XL 56-58",
        value: "XL 56-58",
      },
      {
        label: "XXL 60-62",
        value: "XXL 60-62",
      },
      {
        label: "XXXL 64-66",
        value: "XXXL 64-66",
      },
      {
        label: "XXXXL 68-70",
        value: "XXXXL 68-70",
      },
      {
        label: "XXXXXL 62-74",
        value: "XXXXXL 62-74",
      },
      {
        label: "One size",
        value: "One size",
      },
    ],
  },
  {
    name: "Farkkujen koko",
    type: componentTypes.SELECT,
    label: "Farkkujen koko",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "W 23",
        value: "W 23",
      },
      {
        label: "W 24",
        value: "W 24",
      },
      {
        label: "W 25",
        value: "W 25",
      },
      {
        label: "W 26",
        value: "W 26",
      },
      {
        label: "W 27",
        value: "W 27",
      },
      {
        label: "W 28",
        value: "W 28",
      },
      {
        label: "W 29",
        value: "W 29",
      },
      {
        label: "W 30",
        value: "W 30",
      },
      {
        label: "W 31",
        value: "W 31",
      },
      {
        label: "W 32",
        value: "W 32",
      },
      {
        label: "W 33",
        value: "W 33",
      },
      {
        label: "W 34",
        value: "W 34",
      },
      {
        label: "W 36",
        value: "W 36",
      },
      {
        label: "W 38",
        value: "W 38",
      },
      {
        label: "XXS Naisten farkut",
        value: "XXS Naisten farkut",
      },
      {
        label: "XS Naisten farkut",
        value: "XS Naisten farkut",
      },
      {
        label: "S Naisten farkut",
        value: "S Naisten farkut",
      },
      {
        label: "M Naisten farkut",
        value: "M Naisten farkut",
      },
      {
        label: "L Naisten farkut",
        value: "L Naisten farkut",
      },
      {
        label: "XL Naisten farkut",
        value: "XL Naisten farkut",
      },
      {
        label: "XXL Naisten farkut",
        value: "XXL Naisten farkut",
      },
      {
        label: "XXXL Naisten farkut",
        value: "XXXL Naisten farkut",
      },
      {
        label: "XXXXL Naisten farkut",
        value: "XXXXL Naisten farkut",
      },
      {
        label: "XXXXXL Naisten farkut",
        value: "XXXXXL Naisten farkut",
      },
      {
        label: "XS Miesten farkut",
        value: "XS Miesten farkut",
      },
      {
        label: "S Miesten farkut",
        value: "S Miesten farkut",
      },
      {
        label: "L Miesten farkut",
        value: "L Miesten farkut",
      },
      {
        label: "XL Miesten farkut",
        value: "XL Miesten farkut",
      },
      {
        label: "XXL Miesten farkut",
        value: "XXL Miesten farkut",
      },
      {
        label: "XXXL Miesten farkut",
        value: "XXXL Miesten farkut",
      },
      {
        label: "XXXXL Miesten farkut",
        value: "XXXXL Miesten farkut",
      },
    ],
  },
  {
    name: "Kenkien koot",
    type: componentTypes.SELECT,
    label: "Kenkien koot",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "15",
        value: 15,
      },
      {
        label: "15.5",
        value: 15.5,
      },
      {
        label: "16",
        value: 16,
      },
      {
        label: "16.5",
        value: 16.5,
      },
      {
        label: "17",
        value: 17,
      },
      {
        label: "17.5",
        value: 17.5,
      },
      {
        label: "18",
        value: 18,
      },
      {
        label: "18.5",
        value: 18.5,
      },
      {
        label: "19",
        value: 19,
      },
      {
        label: "19.5",
        value: 19.5,
      },
      {
        label: "20",
        value: 20,
      },
      {
        label: "20.5",
        value: 20.5,
      },
      {
        label: "21",
        value: 21,
      },
      {
        label: "21.5",
        value: 21.5,
      },
      {
        label: "22",
        value: 22,
      },
      {
        label: "22.5",
        value: 22.5,
      },
      {
        label: "23",
        value: 23,
      },
      {
        label: "23.5",
        value: 23.5,
      },
      {
        label: "24",
        value: 24,
      },
      {
        label: "24.5",
        value: 24.5,
      },
      {
        label: "25",
        value: 25,
      },
      {
        label: "25.5",
        value: 25.5,
      },
      {
        label: "26",
        value: 26,
      },
      {
        label: "26.5",
        value: 26.5,
      },
      {
        label: "27",
        value: 27,
      },
      {
        label: "27.5",
        value: 27.5,
      },
      {
        label: "28",
        value: 28,
      },
      {
        label: "28.5",
        value: 28.5,
      },
      {
        label: "29",
        value: 29,
      },
      {
        label: "29.5",
        value: 29.5,
      },
      {
        label: "30",
        value: 30,
      },
      {
        label: "30.5",
        value: 30.5,
      },
      {
        label: "31",
        value: 31,
      },
      {
        label: "31.5",
        value: 31.5,
      },
      {
        label: "32",
        value: 32,
      },
      {
        label: "32.5",
        value: 32.5,
      },
      {
        label: "33",
        value: 33,
      },
      {
        label: "33.5",
        value: 33.5,
      },
      {
        label: "34",
        value: 34,
      },
      {
        label: "34.5",
        value: 34.5,
      },
      {
        label: "35",
        value: 35,
      },
      {
        label: "35.5",
        value: 35.5,
      },
      {
        label: "36",
        value: 36,
      },
      {
        label: "36.5",
        value: 36.5,
      },
      {
        label: "37",
        value: 37,
      },
      {
        label: "37.5",
        value: 37.5,
      },
      {
        label: "38",
        value: 38,
      },
      {
        label: "38.5",
        value: 38.5,
      },
      {
        label: "39",
        value: 39,
      },
      {
        label: "39.5",
        value: 39.5,
      },
      {
        label: "40",
        value: 40,
      },
      {
        label: "40.5",
        value: 40.5,
      },
      {
        label: "41",
        value: 41,
      },
      {
        label: "41.5",
        value: 41.5,
      },
      {
        label: "42",
        value: 42,
      },
      {
        label: "42.5",
        value: 42.5,
      },
      {
        label: "43",
        value: 43,
      },
      {
        label: "43.5",
        value: 43.5,
      },
      {
        label: "44",
        value: 44,
      },
      {
        label: "44.5",
        value: 44.5,
      },
      {
        label: "45",
        value: 45,
      },
      {
        label: "45.5",
        value: 45.5,
      },
      {
        label: "46",
        value: 46,
      },
      {
        label: "46.5",
        value: 46.5,
      },
      {
        label: "47",
        value: 47,
      },
      {
        label: "47.5",
        value: 47.5,
      },
      {
        label: "48",
        value: 48,
      },
      {
        label: "48.5",
        value: 48.5,
      },
      {
        label: "49",
        value: 49,
      },
      {
        label: "49.5",
        value: 49.5,
      },
      {
        label: "50",
        value: 50,
      },
    ],
  },
  {
    name: "Lasten vaatteet",
    type: componentTypes.SELECT,
    label: "Lasten vaatteet",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "50",
        value: "50",
      },
      {
        label: "56",
        value: "56",
      },
      {
        label: "62",
        value: "62",
      },
      {
        label: "68",
        value: "68",
      },
      {
        label: "74",
        value: "74",
      },
      {
        label: "80",
        value: "80",
      },
      {
        label: "86",
        value: "86",
      },
      {
        label: "92",
        value: "92",
      },
      {
        label: "98",
        value: "98",
      },
      {
        label: "104",
        value: "104",
      },
      {
        label: "110",
        value: "110",
      },
      {
        label: "116",
        value: "116",
      },
      {
        label: "122",
        value: "122",
      },
      {
        label: "128",
        value: "128",
      },
      {
        label: "134",
        value: "134",
      },
      {
        label: "140",
        value: "140",
      },
      {
        label: "146",
        value: "146",
      },
      {
        label: "152",
        value: "152",
      },
      {
        label: "158",
        value: "158",
      },
      {
        label: "164",
        value: "164",
      },
      {
        label: "170",
        value: "170",
      },
      {
        label: "Keskoset",
        value: "Keskoset",
      },
      {
        label: "0-3 kk",
        value: "0-3 kk",
      },
      {
        label: "3-6 kk",
        value: "3-6 kk",
      },
      {
        label: "6-9 kk",
        value: "6-9 kk",
      },
      {
        label: "9-12 kk",
        value: "9-12 kk",
      },
      {
        label: "1 v",
        value: "1 v",
      },
      {
        label: "2 v",
        value: "2 v",
      },
      {
        label: "One size",
        value: "One size",
      },
    ],
  },
  {
    name: "heading",
    type: componentTypes.HEADING,
    label: "Muut tiedot",
    cols: 6,
  },
  {
    name: "Paino",
    type: componentTypes.TEXT_FIELD,
    label: "Paino (kg)",
    cols: 2,
    spaceAfter: 1,
  },
  {
    name: "Varasto",
    type: componentTypes.SELECT,
    label: "Varasto",
    cols: 2,
    spaceAfter: 1,
    options: [
      {
        label: "1 - Portti",
        value: "1 - Portti",
      },
      {
        label: "2 - Kontula",
        value: "2 - Kontula",
      },
      {
        label: "3 - Itakeskus",
        value: "3 - Itakeskus",
      },
      {
        label: "4 - Kylasaari",
        value: "4 - Kylasaari",
      },
      {
        label: "5 - Koivukyla",
        value: "5 - Koivukyla",
      },
      {
        label: "6 - Suomenoja",
        value: "6 - Suomenoja",
      },
      {
        label: "7 - Nihtisilta",
        value: "7 - Nihtisilta",
      },
      {
        label: "8 - Oulunkylä",
        value: "8 - Oulunkylä",
      },
      {
        label: "9 - Pop-Up1",
        value: "9 - Pop-Up1",
      },
      {
        label: "10 - Verkkokauppa",
        value: "10 - Verkkokauppa",
      },
      {
        label: "11 - Myyrmäki",
        value: "11 - Myyrmäki",
      },
    ],
  },
  {
    name: "Ympäristösäästö",
    type: componentTypes.TEXT_FIELD,
    label: "Ympäristösäästö",
    cols: 2,
    spaceAfter: 1,
  },
  { name: "Passiivinen", type: componentTypes.CHECKBOX, label: "Passiivinen", cols: 2, spaceAfter: 1 },
  { name: "Hyllypaikka", type: componentTypes.TEXT_FIELD, label: "Hyllypaikka", cols: 2, spaceAfter: 1 },
];

export function AddProduct() {
  const [insertProduct] = useMutation(INSERT_PRODUCT);
  const [insertPictures] = useMutation(INSERT_PICTURES);
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddProductFormValues>({
    defaultValues: {
      photos: [{ url: "" }],
    },
    resolver: yupResolver(yupSchema),
  });
  const router = useRouter();

  const onSubmit = async (values: AddProductFormValues, e: any) => {
    // console.log("save", values);

    // const photo = (values.photo as unknown) as FileList | undefined;

    const action = e.nativeEvent.submitter.dataset.submitAction;

    console.log(values.photos[0]);

    try {
      const { photos: photoObjects, ...product } = values;

      // console.log(product);

      const res = await insertProduct({
        variables: {
          product,
        },
      });

      console.log("added product:", res);

      if (res.errors) {
        console.log("failed to add product:", res.errors);
        return;
      }

      const {
        data: {
          insert_product_one: { id },
        },
      } = res;

      const photos = photoObjects.map((e, i) => ({ url: e.url, order: i, web_shop: true, product_id: id }));

      const res2 = await insertPictures({
        variables: {
          pictures: photos,
        },
      });

      console.log("added pictures:", res2);

      if (res2.errors) {
        console.log("failed to add pictures:", res2.errors);
        return;
      }

      if (action === "submit") {
        // button has "data-submit-action" set to "submit" -> submit and return home
        router.push(`/`);
      } else if (action === "submit-and-print") {
        // button has "data-submit-action" set to "submit-and-print" -> submit and print
        const id = res.data.insert_product_one.id;
        router.push(`/product/${id}/print`);
      } else {
        // "data-submit-action" is not set -> submit and print
        const id = res.data.insert_product_one.id;
        router.push(`/product/${id}/print`);
      }
    } catch (error) {
      console.error(error);
      return alert("Failed adding item");
    }
  };

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Uuden tuotteen lisääminen</h3>
            <p className="mt-1 text-sm text-gray-500">Lisää uusi tuote syöttämällä seuraavat tiedot</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {schema.map((e) => {
              console.log(e.name);
              return React.createElement(componentMapper[e.type], {
                key: e.name,
                register,
                control,
                watch,
                stuff: e,
              });
            })}
          </div>
        </div>
      </div>
      <MyDropzone />
      <div className="pt-5">
        <div className="flex justify-end">
          <Link href="/">
            <button
              type="button"
              // disabled={isSubmitting || !isDirty}
              disabled={isSubmitting}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Peruuta
            </button>
          </Link>
          <button
            type="submit"
            data-submit-action="submit"
            // disabled={isSubmitting || !isDirty}
            disabled={isSubmitting}
            className="ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tallenna
          </button>
          <button
            type="submit"
            data-submit-action="submit-and-print"
            // disabled={isSubmitting || !isDirty}
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tallenna ja tulosta
          </button>
        </div>
      </div>
    </form>
  );
}
