import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { providerApi } from "../../../api/auth";

export function useProviderBusiness() {
  const [searchParams, setSearchParams] = useSearchParams();
  const businessIdFromUrl = searchParams.get("business");

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessIdState] = useState(
    businessIdFromUrl || sessionStorage.getItem("waitless_provider_biz_id") || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await providerApi.getMyBusinesses();
        if (isMounted && res?.data?.businesses) {
          const list = res.data.businesses;
          setBusinesses(list);

          if (list.length > 0) {
            const currentUrlId = searchParams.get("business");
            const storedId = sessionStorage.getItem("waitless_provider_biz_id");

            let matched = list[0]._id;
            if (currentUrlId && list.some((b) => b._id === currentUrlId)) {
              matched = currentUrlId;
            } else if (storedId && list.some((b) => b._id === storedId)) {
              matched = storedId;
            }

            setSelectedBusinessIdState(matched);
            sessionStorage.setItem("waitless_provider_biz_id", matched);

            if (searchParams.get("business") !== matched) {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("business", matched);
                  return next;
                },
                { replace: true }
              );
            }
          } else {
            setSelectedBusinessIdState("");
            sessionStorage.removeItem("waitless_provider_biz_id");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load owned businesses.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, searchParams, setSearchParams]);

  const selectBusiness = useCallback(
    (id) => {
      setSelectedBusinessIdState(id);
      sessionStorage.setItem("waitless_provider_biz_id", id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("business", id);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const refreshBusinesses = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const selectedBusiness = businesses.find((b) => b._id === selectedBusinessId) || null;
  const isPending = selectedBusiness?.approvalStatus === "pending";
  const isSuspended = selectedBusiness?.approvalStatus === "suspended";
  const isInactive = selectedBusiness?.isActive === false;

  return {
    businesses,
    selectedBusinessId,
    selectedBusiness,
    setSelectedBusinessId: selectBusiness,
    loading,
    error,
    refreshBusinesses,
    isPending,
    isSuspended,
    isInactive,
  };
}
