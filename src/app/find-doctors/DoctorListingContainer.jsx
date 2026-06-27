"use client";

import React, { useState, useEffect } from "react";
import DoctorCard from "./DoctorCard";
import DoctorFilters from "./DoctorFilters";
import { useRouter } from "next/navigation";
// import { Pagination } from "@heroui/react";

export default function DoctorListingContainer({
  doctors,
  filters,
  total,
}) {
 const [searchQuery, setSearchQuery] = useState(filters?.search || "");
  const [specialization, setSpecialization] = useState(
    filters?.specialization || "all"
  );
  const [sortOrder, setSortOrder] = useState(filters?.sort || "default");
  const [page, setPage] = useState(Number(filters?.page) || 1);

//   const router = useRouter();

  const router = useRouter();

  const itemsPerPage = 12;
  const totalPages = Math.ceil(total / itemsPerPage);

  const startItem = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, total);

  // Filter change handlers
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSpecializationChange = (value) => {
    setSpecialization(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setPage(1);
  };

  // URL sync
  useEffect(() => {
    const sp = new URLSearchParams();

    if (searchQuery) sp.set("search", searchQuery);
    if (specialization !== "all")
      sp.set("specialization", specialization);
    if (sortOrder !== "default")
      sp.set("sort", sortOrder);
    if (page > 1)
      sp.set("page", page.toString());

    router.replace(`?${sp.toString()}`);
  }, [searchQuery, specialization, sortOrder, page, router]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return [1];

    pages.push(1);

    if (page > 3) pages.push("ellipsis");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  return (
    <>
      <DoctorFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        specialization={specialization}
        setSpecialization={handleSpecializationChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
      />

      <div className="max-w-7xl mx-auto mb-6 text-sm text-zinc-500">
        Showing {doctors.length} doctor
        {doctors.length !== 1 && "s"} matched
      </div>

      {doctors.length > 0 ? (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id?.$oid || doctor._id}
                doctor={doctor}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-10">
              <p className="text-sm text-zinc-500">
                Showing {startItem}–{endItem} of {total} results
              </p>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 disabled:opacity-40"
                >
                  Previous
                </button>

                {getPageNumbers().map((p, index) =>
                  p === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-zinc-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        page === p
                          ? "bg-blue-600 text-white"
                          : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[32px] max-w-7xl mx-auto">
          <p className="text-zinc-500 text-lg">
            No specialist found matching your criteria.
          </p>
        </div>
      )}
    </>
  );
}