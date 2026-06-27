"use client";

import React from "react";
import { TextField, InputGroup, Select, ListBox } from "@heroui/react";
import { Magnifier, ChevronDown } from "@gravity-ui/icons";

export default function DoctorFilters({ 
  searchQuery, setSearchQuery, 
  specialization, setSpecialization, 
  sortOrder, setSortOrder 
}) {
  // আপনার ডাটার সাথে মিল রেখে স্পেশালাইজেশন লিস্ট
  const specialties = ["General Medicine", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Cardiology"];

  return (
    <div className="flex flex-col gap-4 bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-800/80 max-w-7xl mx-auto mb-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* ১. নাম ও হসপিটাল সার্চ */}
        <div className="md:col-span-5">
          <TextField className="w-full">
            <span className="text-sm font-medium text-zinc-400 block mb-2">Search Doctor</span>
            <InputGroup className="bg-zinc-800 border-zinc-700 focus-within:border-blue-500 rounded-xl transition-all">
              <InputGroup.Prefix className="pl-3 text-zinc-500">
                <Magnifier className="w-4 h-4" />
              </InputGroup.Prefix>
              {/* 🎯 ফিক্স: value এবং onChange প্রোপার্টি সরাসরি Input-এ দেওয়া হলো */}
              <InputGroup.Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Doctor name or hospital..." 
                className="bg-transparent text-white placeholder-zinc-500 text-sm py-2.5 px-3 outline-none w-full"
              />
            </InputGroup>
          </TextField>
        </div>

        {/* ২. স্পেশালাইজেশন ড্রপডাউন */}
        <div className="md:col-span-4">
          <span className="text-sm font-medium text-zinc-400 block mb-2">Specialization</span>
          <Select selectedKey={specialization} onSelectionChange={(key) => setSpecialization(key)}>
            <Select.Trigger className="w-full flex items-center justify-between bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl py-2.5 px-4 text-sm font-normal transition-all">
              <Select.Value>{specialization === "all" ? "All Specialties" : specialization}</Select.Value>
              <Select.Indicator><ChevronDown className="w-4 h-4 text-zinc-400" /></Select.Indicator>
            </Select.Trigger>
            
            <Select.Popover className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl mt-1 overflow-hidden z-50">
              <ListBox className="p-1">
                <ListBox.Item id="all" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">
                  All Specialties
                </ListBox.Item>
                {specialties.map((spec) => (
                  <ListBox.Item key={spec} id={spec} className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">
                    {spec}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* ৩. সোর্টিং ড্রপডাউন */}
        <div className="md:col-span-3">
          <span className="text-sm font-medium text-zinc-400 block mb-2">Sort By</span>
          <Select selectedKey={sortOrder} onSelectionChange={(key) => setSortOrder(key)}>
            <Select.Trigger className="w-full flex items-center justify-between bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl py-2.5 px-4 text-sm font-normal transition-all">
              <Select.Value>
                {sortOrder === "fee-low-high" ? "Fee: Low to High" : 
                 sortOrder === "fee-high-low" ? "Fee: High to Low" : 
                 sortOrder === "experience" ? "Experience" : 
                 sortOrder === "rating" ? "Highest Rating" : "Default Sort"}
              </Select.Value>
              <Select.Indicator><ChevronDown className="w-4 h-4 text-zinc-400" /></Select.Indicator>
            </Select.Trigger>
            
            <Select.Popover className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl mt-1 overflow-hidden z-50">
              <ListBox className="p-1">
                <ListBox.Item id="default" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">Default Sort</ListBox.Item>
                <ListBox.Item id="fee-low-high" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">Fee: Low to High</ListBox.Item>
                <ListBox.Item id="fee-high-low" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">Fee: High to Low</ListBox.Item>
                <ListBox.Item id="experience" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">Experience</ListBox.Item>
                <ListBox.Item id="rating" className="text-zinc-200 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-2 text-sm cursor-pointer">Highest Rating</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

      </div>
    </div>
  );
}