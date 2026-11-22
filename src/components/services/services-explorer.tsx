"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPublicServices, type Service, type ServiceQuery } from "@/lib/api/services";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const MODES = ["Home Visit", "Shop Drop-off"];

const selectClass =
  "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700";

const ServicesExplorer = ({ initialCategory = "" }: { initialCategory?: string }) => {
  const [searchText, setSearchText] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [mode, setMode] = useState("");
  const [sort, setSort] = useState<ServiceQuery["sort"]>("newest");
  const [page, setPage] = useState(1);

  // Result state
  const [services, setServices] = useState<Service[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  // Any filter changes -> fetch again
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getPublicServices({
          q: q || undefined,
          category: category || undefined,
          serviceMode: mode || undefined,
          sort,
          page,
          limit: 12,
        });

        setServices(data.services);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load services.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [q, category, mode, sort, page, reload]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setQ(searchText.trim());
            setPage(1);
          }}
        >
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search services..."
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
          />
          <button className="shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">Any service mode</option>
          {MODES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as ServiceQuery["sort"]);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="title">Title: A to Z</option>
        </select>
      </div>

      {/* States */}
      {loading && <p className="py-16 text-center text-slate-500">Loading services...</p>}

      {!loading && error && (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setReload((value) => value + 1)}
            className="mt-4 rounded-lg border px-4 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="font-semibold text-slate-900">No services found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different search.</p>
        </div>
      )}

      {/* Cards */}
      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="relative h-40 bg-slate-100">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>

              <div className="space-y-2 p-5">
                <p className="text-xs font-semibold text-blue-600">{service.category}</p>
                <h3 className="font-bold text-slate-900">{service.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-500">{service.description}</p>

                <p className="text-xs text-slate-500">
                  {service.estimatedDuration} · {service.serviceMode} · {service.serviceArea}
                </p>
                <p className="text-xs text-slate-500">By {service.technicianName}</p>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-lg font-bold text-blue-600">
                    ${service.basePrice}
                  </span>
                  <a
                    href={`/sign-in?callbackUrl=/dashboard/customer/bookings?service=${service._id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesExplorer;
