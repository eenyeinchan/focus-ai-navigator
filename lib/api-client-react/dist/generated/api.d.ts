import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActionPlan, ActivityItem, BlockedSite, CreateBlockedSiteBody, CreateFocusSessionBody, CreateNoteBody, CreateTaskBody, DashboardSummary, ErrorResponse, FocusSession, HealthStatus, ListNotesParams, ListTasksParams, Note, NoteAnalysis, Task, UpdateFocusSessionBody, UpdateNoteBody, UpdateTaskBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all notes
 */
export declare const getListNotesUrl: (params?: ListNotesParams) => string;
export declare const listNotes: (params?: ListNotesParams, options?: RequestInit) => Promise<Note[]>;
export declare const getListNotesQueryKey: (params?: ListNotesParams) => readonly ["/api/notes", ...ListNotesParams[]];
export declare const getListNotesQueryOptions: <TData = Awaited<ReturnType<typeof listNotes>>, TError = ErrorType<unknown>>(params?: ListNotesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNotes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNotesQueryResult = NonNullable<Awaited<ReturnType<typeof listNotes>>>;
export type ListNotesQueryError = ErrorType<unknown>;
/**
 * @summary List all notes
 */
export declare function useListNotes<TData = Awaited<ReturnType<typeof listNotes>>, TError = ErrorType<unknown>>(params?: ListNotesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new note
 */
export declare const getCreateNoteUrl: () => string;
export declare const createNote: (createNoteBody: CreateNoteBody, options?: RequestInit) => Promise<Note>;
export declare const getCreateNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNote>>, TError, {
        data: BodyType<CreateNoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createNote>>, TError, {
    data: BodyType<CreateNoteBody>;
}, TContext>;
export type CreateNoteMutationResult = NonNullable<Awaited<ReturnType<typeof createNote>>>;
export type CreateNoteMutationBody = BodyType<CreateNoteBody>;
export type CreateNoteMutationError = ErrorType<unknown>;
/**
 * @summary Create a new note
 */
export declare const useCreateNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNote>>, TError, {
        data: BodyType<CreateNoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createNote>>, TError, {
    data: BodyType<CreateNoteBody>;
}, TContext>;
/**
 * @summary Get a note by ID
 */
export declare const getGetNoteUrl: (id: number) => string;
export declare const getNote: (id: number, options?: RequestInit) => Promise<Note>;
export declare const getGetNoteQueryKey: (id: number) => readonly [`/api/notes/${number}`];
export declare const getGetNoteQueryOptions: <TData = Awaited<ReturnType<typeof getNote>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNote>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNote>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNoteQueryResult = NonNullable<Awaited<ReturnType<typeof getNote>>>;
export type GetNoteQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a note by ID
 */
export declare function useGetNote<TData = Awaited<ReturnType<typeof getNote>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNote>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a note
 */
export declare const getUpdateNoteUrl: (id: number) => string;
export declare const updateNote: (id: number, updateNoteBody: UpdateNoteBody, options?: RequestInit) => Promise<Note>;
export declare const getUpdateNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
        id: number;
        data: BodyType<UpdateNoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
    id: number;
    data: BodyType<UpdateNoteBody>;
}, TContext>;
export type UpdateNoteMutationResult = NonNullable<Awaited<ReturnType<typeof updateNote>>>;
export type UpdateNoteMutationBody = BodyType<UpdateNoteBody>;
export type UpdateNoteMutationError = ErrorType<unknown>;
/**
 * @summary Update a note
 */
export declare const useUpdateNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
        id: number;
        data: BodyType<UpdateNoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateNote>>, TError, {
    id: number;
    data: BodyType<UpdateNoteBody>;
}, TContext>;
/**
 * @summary Delete a note
 */
export declare const getDeleteNoteUrl: (id: number) => string;
export declare const deleteNote: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
    id: number;
}, TContext>;
export type DeleteNoteMutationResult = NonNullable<Awaited<ReturnType<typeof deleteNote>>>;
export type DeleteNoteMutationError = ErrorType<unknown>;
/**
 * @summary Delete a note
 */
export declare const useDeleteNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteNote>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Run AI analysis on a note to extract tasks and insights
 */
export declare const getAnalyzeNoteUrl: (id: number) => string;
export declare const analyzeNote: (id: number, options?: RequestInit) => Promise<NoteAnalysis>;
export declare const getAnalyzeNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeNote>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeNote>>, TError, {
    id: number;
}, TContext>;
export type AnalyzeNoteMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeNote>>>;
export type AnalyzeNoteMutationError = ErrorType<unknown>;
/**
 * @summary Run AI analysis on a note to extract tasks and insights
 */
export declare const useAnalyzeNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeNote>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof analyzeNote>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all tasks
 */
export declare const getListTasksUrl: (params?: ListTasksParams) => string;
export declare const listTasks: (params?: ListTasksParams, options?: RequestInit) => Promise<Task[]>;
export declare const getListTasksQueryKey: (params?: ListTasksParams) => readonly ["/api/tasks", ...ListTasksParams[]];
export declare const getListTasksQueryOptions: <TData = Awaited<ReturnType<typeof listTasks>>, TError = ErrorType<unknown>>(params?: ListTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTasksQueryResult = NonNullable<Awaited<ReturnType<typeof listTasks>>>;
export type ListTasksQueryError = ErrorType<unknown>;
/**
 * @summary List all tasks
 */
export declare function useListTasks<TData = Awaited<ReturnType<typeof listTasks>>, TError = ErrorType<unknown>>(params?: ListTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a task
 */
export declare const getCreateTaskUrl: () => string;
export declare const createTask: (createTaskBody: CreateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getCreateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
export type CreateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof createTask>>>;
export type CreateTaskMutationBody = BodyType<CreateTaskBody>;
export type CreateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Create a task
 */
export declare const useCreateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
/**
 * @summary Update a task
 */
export declare const getUpdateTaskUrl: (id: number) => string;
export declare const updateTask: (id: number, updateTaskBody: UpdateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getUpdateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
export type UpdateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof updateTask>>>;
export type UpdateTaskMutationBody = BodyType<UpdateTaskBody>;
export type UpdateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Update a task
 */
export declare const useUpdateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
/**
 * @summary Delete a task
 */
export declare const getDeleteTaskUrl: (id: number) => string;
export declare const deleteTask: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
export type DeleteTaskMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTask>>>;
export type DeleteTaskMutationError = ErrorType<unknown>;
/**
 * @summary Delete a task
 */
export declare const useDeleteTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List focus sessions
 */
export declare const getListFocusSessionsUrl: () => string;
export declare const listFocusSessions: (options?: RequestInit) => Promise<FocusSession[]>;
export declare const getListFocusSessionsQueryKey: () => readonly ["/api/focus-sessions"];
export declare const getListFocusSessionsQueryOptions: <TData = Awaited<ReturnType<typeof listFocusSessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFocusSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFocusSessions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFocusSessionsQueryResult = NonNullable<Awaited<ReturnType<typeof listFocusSessions>>>;
export type ListFocusSessionsQueryError = ErrorType<unknown>;
/**
 * @summary List focus sessions
 */
export declare function useListFocusSessions<TData = Awaited<ReturnType<typeof listFocusSessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFocusSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start a new focus session
 */
export declare const getCreateFocusSessionUrl: () => string;
export declare const createFocusSession: (createFocusSessionBody: CreateFocusSessionBody, options?: RequestInit) => Promise<FocusSession>;
export declare const getCreateFocusSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFocusSession>>, TError, {
        data: BodyType<CreateFocusSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFocusSession>>, TError, {
    data: BodyType<CreateFocusSessionBody>;
}, TContext>;
export type CreateFocusSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createFocusSession>>>;
export type CreateFocusSessionMutationBody = BodyType<CreateFocusSessionBody>;
export type CreateFocusSessionMutationError = ErrorType<unknown>;
/**
 * @summary Start a new focus session
 */
export declare const useCreateFocusSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFocusSession>>, TError, {
        data: BodyType<CreateFocusSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFocusSession>>, TError, {
    data: BodyType<CreateFocusSessionBody>;
}, TContext>;
/**
 * @summary Update a focus session (end it, update status)
 */
export declare const getUpdateFocusSessionUrl: (id: number) => string;
export declare const updateFocusSession: (id: number, updateFocusSessionBody: UpdateFocusSessionBody, options?: RequestInit) => Promise<FocusSession>;
export declare const getUpdateFocusSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFocusSession>>, TError, {
        id: number;
        data: BodyType<UpdateFocusSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFocusSession>>, TError, {
    id: number;
    data: BodyType<UpdateFocusSessionBody>;
}, TContext>;
export type UpdateFocusSessionMutationResult = NonNullable<Awaited<ReturnType<typeof updateFocusSession>>>;
export type UpdateFocusSessionMutationBody = BodyType<UpdateFocusSessionBody>;
export type UpdateFocusSessionMutationError = ErrorType<unknown>;
/**
 * @summary Update a focus session (end it, update status)
 */
export declare const useUpdateFocusSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFocusSession>>, TError, {
        id: number;
        data: BodyType<UpdateFocusSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFocusSession>>, TError, {
    id: number;
    data: BodyType<UpdateFocusSessionBody>;
}, TContext>;
/**
 * @summary List all blocked site patterns
 */
export declare const getListBlockedSitesUrl: () => string;
export declare const listBlockedSites: (options?: RequestInit) => Promise<BlockedSite[]>;
export declare const getListBlockedSitesQueryKey: () => readonly ["/api/blocked-sites"];
export declare const getListBlockedSitesQueryOptions: <TData = Awaited<ReturnType<typeof listBlockedSites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlockedSites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBlockedSites>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBlockedSitesQueryResult = NonNullable<Awaited<ReturnType<typeof listBlockedSites>>>;
export type ListBlockedSitesQueryError = ErrorType<unknown>;
/**
 * @summary List all blocked site patterns
 */
export declare function useListBlockedSites<TData = Awaited<ReturnType<typeof listBlockedSites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlockedSites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a site to block list
 */
export declare const getCreateBlockedSiteUrl: () => string;
export declare const createBlockedSite: (createBlockedSiteBody: CreateBlockedSiteBody, options?: RequestInit) => Promise<BlockedSite>;
export declare const getCreateBlockedSiteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlockedSite>>, TError, {
        data: BodyType<CreateBlockedSiteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBlockedSite>>, TError, {
    data: BodyType<CreateBlockedSiteBody>;
}, TContext>;
export type CreateBlockedSiteMutationResult = NonNullable<Awaited<ReturnType<typeof createBlockedSite>>>;
export type CreateBlockedSiteMutationBody = BodyType<CreateBlockedSiteBody>;
export type CreateBlockedSiteMutationError = ErrorType<unknown>;
/**
 * @summary Add a site to block list
 */
export declare const useCreateBlockedSite: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlockedSite>>, TError, {
        data: BodyType<CreateBlockedSiteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBlockedSite>>, TError, {
    data: BodyType<CreateBlockedSiteBody>;
}, TContext>;
/**
 * @summary Remove a site from block list
 */
export declare const getDeleteBlockedSiteUrl: (id: number) => string;
export declare const deleteBlockedSite: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteBlockedSiteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlockedSite>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBlockedSite>>, TError, {
    id: number;
}, TContext>;
export type DeleteBlockedSiteMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBlockedSite>>>;
export type DeleteBlockedSiteMutationError = ErrorType<unknown>;
/**
 * @summary Remove a site from block list
 */
export declare const useDeleteBlockedSite: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlockedSite>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBlockedSite>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get productivity summary stats
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get productivity summary stats
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get AI-generated prioritized action plan from recent notes and tasks
 */
export declare const getGetActionPlanUrl: () => string;
export declare const getActionPlan: (options?: RequestInit) => Promise<ActionPlan>;
export declare const getGetActionPlanQueryKey: () => readonly ["/api/dashboard/action-plan"];
export declare const getGetActionPlanQueryOptions: <TData = Awaited<ReturnType<typeof getActionPlan>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActionPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActionPlan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActionPlanQueryResult = NonNullable<Awaited<ReturnType<typeof getActionPlan>>>;
export type GetActionPlanQueryError = ErrorType<unknown>;
/**
 * @summary Get AI-generated prioritized action plan from recent notes and tasks
 */
export declare function useGetActionPlan<TData = Awaited<ReturnType<typeof getActionPlan>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActionPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent activity feed
 */
export declare const getGetRecentActivityUrl: () => string;
export declare const getRecentActivity: (options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetRecentActivityQueryKey: () => readonly ["/api/dashboard/activity"];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent activity feed
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map