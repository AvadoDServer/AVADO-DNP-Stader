import { Fragment, useEffect, useState } from 'react'
import type { NextPage } from 'next';
import {
  PlayIcon,
  AdjustmentsHorizontalIcon,
  ServerIcon,
  PencilIcon,
  LinkIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/20/solid'
import InitWallet from '../components/InitWallet';

const steps = [
  { id: '01', name: 'Init wallet', status: 'current' },
  { id: '02', name: 'Fund node', status: 'upcoming' },
  { id: '03', name: 'Register node', status: 'upcoming' },
]

const Node: NextPage = () => {
  return (
    <>
      <nav aria-label="Progress">
        <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === 'complete' ? (
                <div className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                </div>
              ) : step.status === 'current' ? (
                <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                    <span className="text-indigo-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
      <div>
        <InitWallet onFinished={() => { }} />
      </div>
    </>
  )
}

export default Node;