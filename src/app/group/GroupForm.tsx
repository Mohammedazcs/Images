'use client'
import React, { useEffect, useState } from 'react'
import {AlertDialog, Flex, Button, Dialog, Flex as RadixFlex, TextField, Text as RadixText, Card, Text, Table, TableBody} from "@radix-ui/themes"
import axios from 'axios';
import { useQuery } from 'react-query';

type Props = {}

interface Branch {
    id:number
    name: string
}

const AddDataBranchForm = (props: Props) => {
    const [group, setGroup] = useState('')
    const [editGroup, seteditGroup] = useState('')
    const [iseditable, setIseditable] = useState(false);
    const [tobeEdited, settobeEdited] = useState<number>();
    const [tobedeledted, settobedeleted] = useState<number>()

    const addDepartments = async () => {
      try {
        const response = await axios.post('/api/group', {
          name: group
        });
    
        if (response.status === 200) {
          seteditGroup('')
          setGroup('')
          await refetchGroupData()
        } else {
          console.error('Branch could not be added. Status code:', response.status);
        }
      } catch (error) {
        console.error('An error occurred while adding the branch', error);
      }
    };

    const confirmDelete = async (id: number) => {
      try {
        const response = await axios.delete(`/api/group`,{
          params:{
            id:id
          }
        });
        if (response.status === 200) {
          await refetchGroupData()
        } else {
          console.error('Branch could not be deleted. Status code:', response.status);
        }
      } catch (error) {
        console.error('An error occurred while deleting the branch', error);
      } finally {
        settobedeleted(undefined)
      }
    };

    const saveChanges = async () => {
      if(editGroup){
        try {
          const response = await axios.patch(`/api/group`,{
              id:tobeEdited,
              name:editGroup
          });
          if (response.status === 200) {
            console.log('Branch edited successfully');
            setIseditable(false);
            settobeEdited(undefined)
            seteditGroup('')
            await refetchGroupData()
            
          } else {
            console.error('Branch could not be edited. Status code:', response.status);
          }
        } catch (error) {
          console.error('An error occurred while editing the branch', error);
        }
      }
    }
    

      const {data: GroupData, error: GroupDatanError, isLoading: isGroupDataLoading, refetch:refetchGroupData} = useQuery<Branch[]>({
        queryKey:'GroupData',
        queryFn: ()=> axios.get('/api/group').then((res) => res.data),
        staleTime:60 * 1000,
        retry:3
    })

      const handleChangeDep = (event:any) => {
        setGroup(event.target.value);
      };
      const handleChangeEditDep = (event: any) => {
        seteditGroup(event.target.value);
      };

      const GroupToEdit = GroupData?.find((Group) => Group.id === tobeEdited);
      console.log(GroupToEdit)

      
  return (
    <div className='my-10'>
        <Text size='8'  className='mb-10 text-center font-semibold block'>Add Group</Text>
        <div className='my-6'></div>
        <TextField.Input size='3' className='text-xl' onChange={handleChangeDep} value={group} placeholder='Name of Branch'/>
        <div className='my-6'></div>
        <Button onClick={addDepartments} size='4' className='text-gray-50 bg-gray-800 px-10 text-3xl' color='crimson'>Add</Button>
        <div className='my-6'></div>
        <Card>
            <Text size='6' className='font-semibold'>List of Groups</Text>
            <Table.Root className='my-5'>
            <Table.Header>
                <Table.Row>
                <Table.ColumnHeaderCell className='text-lg'>Group Id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className='text-lg' >Group Name</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            {GroupData && (
            <TableBody>
                {GroupData.map((item) => (
                <Table.Row key={item.id} >
                    <Table.Cell >
                        <Text size='5' className='font-medium'>{item.id}</Text> 
                    </Table.Cell>
                    <Table.Cell>
                    <div className='flex items-center justify-between space-x-6'>
                      <Text size='4' >{item.name}</Text>
                      <div className='flex items-center space-x-2'>
                        <div className={` ${iseditable ? "hidden":""}`}>
                      <RadixFlex gap='5'>
                        <Dialog.Root>
                          <Dialog.Trigger onClick={() => {settobeEdited(item.id)}}>
                            <Button size='3' color="gray">Edit</Button>
                          </Dialog.Trigger>
                          <Dialog.Content style={{ maxWidth: 450 }}>
                            <Dialog.Title>Edit Group</Dialog.Title>
                            <RadixFlex direction="column" gap="3">
                                <label>
                                  <RadixText as="div" size="2" mb="1" weight="bold">
                                    Edit Group :- {GroupData?.find((Group) => Group.id === tobeEdited)?.name}
                                  </RadixText>
                                  <TextField.Input onChange={handleChangeEditDep} value={editGroup}
                                    defaultValue=""
                                    placeholder="Enter new branch name"
                                  />
                                </label>
                              </RadixFlex>
                            <RadixFlex gap="3" mt="4" justify="end">
                              <Dialog.Close>
                                  <Button size='3' onClick={() => {setIseditable(false); settobeEdited(undefined)}} variant="soft" color="gray">
                                    Cancel
                                  </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                  <Button onClick={saveChanges} >Save</Button>
                                </Dialog.Close>
                            </RadixFlex>
                          </Dialog.Content>
                        </Dialog.Root>
                        <AlertDialog.Root>
                          <AlertDialog.Trigger onClick={() => {settobedeleted(item.id)}}>
                            <Button size='3' color="red">Delete</Button>
                          </AlertDialog.Trigger>
                          <AlertDialog.Content style={{ maxWidth: 450 }}>
                            <AlertDialog.Title>Delete Branch : {GroupData?.find((Group) => Group.id === tobedeledted)?.name}</AlertDialog.Title>
                            <AlertDialog.Description size="2">
                              Are you sure you want to delete this Branch? data related to this branch will all be deleted.
                            </AlertDialog.Description>

                            <RadixFlex gap="3" mt="4" justify="end">
                              <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">
                                  Cancel
                                </Button>
                              </AlertDialog.Cancel>
                              <AlertDialog.Action>
                                {tobedeledted && 
                                    <Button onClick={() => confirmDelete(tobedeledted)} variant="solid" color="red">
                                    Delete
                                  </Button>
                                }
                              </AlertDialog.Action>
                            </RadixFlex>
                          </AlertDialog.Content>
                        </AlertDialog.Root>
                        </RadixFlex>
                        </div>
                      </div>
                    </div>
                    </Table.Cell>
                </Table.Row>
                ))}
            </TableBody>
            )}
            </Table.Root>
        </Card>
    </div>
  )
}

export default AddDataBranchForm