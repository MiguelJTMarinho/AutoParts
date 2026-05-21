import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SortOptions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    setSearchParams(params);
  };
  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">{t("sortOptions.default")}</option>
        <option value="price_asc">{t("sortOptions.priceAsc")}</option>
        <option value="price_desc">{t("sortOptions.priceDesc")}</option>
      </select>
    </div>
  );
};

export default SortOptions;
