import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase-client";

export function useRealtimeQuery(queryKey: any[], table: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKey, queryClient]);
}


