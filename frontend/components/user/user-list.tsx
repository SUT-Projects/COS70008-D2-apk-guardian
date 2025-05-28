"use client";

import { FILTERED_USERS_URL, UPDATE_USER_URL } from "@/config/api-endpoints";
import { useRouter } from "next/navigation";
import { ReactNode, use, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ContentLoader from "../loaders/content-loader";
import NoDataFound from "../no-data-found";
import { Card, CardHeader } from "@heroui/card";
import { roboto } from "@/config/fonts";
import { Cancel, CheckCircle, FileDownload, PersonAdd, Tab, UnfoldMore } from "@mui/icons-material";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { format } from "date-fns"
import { Chip } from "@heroui/chip";
import { Select, SelectItem, SelectProps } from "@heroui/select";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { WrapImageWithLoader } from "../loaders/image-with-loader";
import { Button } from "@heroui/button";
import { AdminUserForm } from "./create-form";

export type UserListProps = {
  isUserView?: boolean;
}

export default function UserList({
  isUserView = false,
}: UserListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Array<any>>([]);

  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);
  const [currentRowIdx, setCurrentRowIdx] = useState<number>(-1);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const accountStatusMap: Record<number, "default" | "success" | "warning" | "danger"> = {
    0: "default",
    1: "success",
    2: "warning",
    3: "danger",
  };
  const {
    isOpen,
    onClose,
    onOpen,
    onOpenChange
  } = useDisclosure();

  const fetchUsers = useCallback(async () => {
    try {
      const result = await fetch(`${FILTERED_USERS_URL}?user_type=${Number(isUserView)}`);
      if (!result.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await result.json();
      console.log("Fetched users:", data);
      setLoading(false);
      setUsers([...Array.from(data["data"])]);

    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);

      toast.error("Failed to fetch users");
      router.refresh();
    }
  }, [isUserView]);

  const onStatusChange = async (newStatus: number, userId: string, idx: number) => {
    if (newStatus === users[idx].account_status) return;
    setIsUserUpdating(true);
    setCurrentRowIdx(idx);

    try {
      const res = await fetch(`${UPDATE_USER_URL}?user_id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");

      // update local state
      const response = await res.json();
      setUsers((prev) => {
        const copy = [...prev];
        copy[idx] = { ...response["data"] };
        return copy;
      });
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsUserUpdating(false);
      setCurrentRowIdx(-1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <ContentLoader />;
  return (
    <>
      <div className="min-w-full">
        <Card shadow="sm">
          <CardHeader>
            <div className="grid grid-cols-12 gap-2 w-full h-full">
              <div className="col-span-6 flex flex-col justify-start items-start">
                <h3
                  className={clsx(
                    roboto.className,
                    "m-0 text-primary font-semibold text-xl mb-2",
                  )}
                >
                  Users ({users?.length ?? 0})
                </h3>
              </div>
              <div className="col-span-6 flex items-start justify-end gap-2">
                <div className="flex justify-end items-end gap-2">
                  {/* <MonthSelector defaultDate={startDate} /> */}
                  {!isUserView && (
                    <Button
                      variant="solid"
                      color="primary"
                      radius="full"
                      startContent={<PersonAdd />}
                      onPress={() => onOpen()}>
                      Create Admin
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          {users?.length === 0 ? (
            <NoDataFound
              // message={`For selected month: ${format(startDate, "LLLL yyyy")}`}
              title="No Recruiter Founds"
            />
          ) : (
            <Table className="p-0" shadow="none" aria-labelledby="user-list-table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Account Status</TableColumn>
                <TableColumn>Last Login</TableColumn>
                <TableColumn>Start Date</TableColumn>
                <TableColumn>End Date</TableColumn>
              </TableHeader>
              <TableBody loadingContent={<ContentLoader />} loadingState={loading || users.length === 0 ? "loading" : "idle"}>
                {users?.map((user, idx) => {
                  const isThisRowUpdating = isUserUpdating && currentRowIdx === idx;

                  return (
                    <TableRow
                      key={`${user.userId}-${idx}`}
                    >
                      <TableCell>{user.name ?? "-"}</TableCell>
                      <TableCell>{user.email ?? "-"}</TableCell>
                      <TableCell>

                        <Select
                          key={`${user.userId}-${idx}`}
                          size="sm"
                          radius="full"
                          color={accountStatusMap[user?.account_status ?? 1]}
                          selectedKeys={new Set([(user?.account_status ?? 1).toString()])}
                          onSelectionChange={(key) => {
                            console.log(key);
                            if (key.currentKey === null) return;
                            onStatusChange(
                              Number(key.currentKey),
                              user._id,
                              idx
                            );
                          }}
                          isDisabled={isThisRowUpdating}
                          isLoading={isThisRowUpdating}
                          aria-labelledby={`user-account-status-${idx}`}
                          disabledKeys={["0"]}
                        >
                          <SelectItem key={"0"} color="default" variant="flat">Pending</SelectItem>
                          <SelectItem key={"1"}>Active</SelectItem>
                          <SelectItem key={"2"}>Suspend</SelectItem>
                          <SelectItem key={"3"}>In-active</SelectItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.last_login_date
                          ? format(new Date(user.last_login_date), "Pp")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {user.created_date
                          ? format(new Date(user.created_date), "Pp")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {user.updated_date ? format(new Date(user.updated_date), "Pp") : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
        <ModalContent>
          {(onClose) => (
            <AdminUserForm
              key={new Date().getTime().toString()}
              user={selectedUser}
              onClose={onClose}
              onSuccess={fetchUsers}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}