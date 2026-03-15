import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Settings, 
  Globe, 
  Zap, 
  Wifi, 
  Activity, 
  ChevronRight, 
  Server, 
  Smartphone, 
  Gamepad2, 
  Share2,
  X,
  CheckCircle2
} from 'lucide-react';

const SERVERS = [
  { id: 'za', name: 'África do Sul', ping: 45, icon: '🇿🇦', type: 'Premium' },
  { id: 'pt', name: 'Portugal', ping: 110, icon: '🇵🇹', type: 'Premium' },
  { id: 'br', name: 'Brasil', ping: 130, icon: '🇧🇷', type: 'Standard' },
  { id: 'ao', name: 'Angola (Gaming)', ping: 15, icon: '🇦🇴', type: 'Gaming' },
];

const NETWORKS = [
  { id: 'africell', name: 'Africell Angola', protocol: 'WireGuard (UDP 443)', sni: 'www.africell.ao' },
  { id: 'unitel', name: 'Unitel Angola', protocol: 'Slow DNS / SSL', sni: 'v.whatsapp.net' },
];

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [showServerModal, setShowServerModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  
  // Premium Features State
  const [splitTunneling, setSplitTunneling] = useState(false);
  const [gamingMode, setGamingMode] = useState(false);
  const [hotshare, setHotshare] = useState(false);

  const [stats, setStats] = useState({ ping: 0, dl: 0, ul: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setStats({
          ping: selectedServer.ping + Math.floor(Math.random() * 10 - 5),
          dl: +(Math.random() * 50 + 10).toFixed(1),
          ul: +(Math.random() * 20 + 5).toFixed(1),
        });
      }, 2000);
    } else {
      setStats({ ping: 0, dl: 0, ul: 0 });
    }
    return () => clearInterval(interval);
  }, [isConnected, selectedServer]);

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      return;
    }
    
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 flex justify-center">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-zinc-900/50 shadow-2xl overflow-hidden relative flex flex-col sm:border-x sm:border-zinc-800/50">
        
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Angola VPN</h1>
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'home' ? 'settings' : 'home')}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            {activeTab === 'home' ? <Settings className="w-5 h-5 text-zinc-400" /> : <X className="w-5 h-5 text-zinc-400" />}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 flex flex-col items-center justify-center min-h-full"
              >
                {/* Status Indicator */}
                <div className="mb-12 text-center">
                  <motion.div 
                    animate={{ 
                      scale: isConnecting ? [1, 1.05, 1] : 1,
                      opacity: isConnecting ? [0.7, 1, 0.7] : 1
                    }}
                    transition={{ repeat: isConnecting ? Infinity : 0, duration: 1.5 }}
                    className="relative inline-block"
                  >
                    <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${
                      isConnected ? 'bg-emerald-500' : isConnecting ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <button 
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 ${
                        isConnected 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
                          : isConnecting
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                            : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400'
                      }`}
                    >
                      {isConnected ? (
                        <ShieldCheck className="w-16 h-16 mb-2" />
                      ) : isConnecting ? (
                        <Activity className="w-16 h-16 mb-2 animate-pulse" />
                      ) : (
                        <Shield className="w-16 h-16 mb-2" />
                      )}
                      <span className="font-medium text-sm uppercase tracking-wider">
                        {isConnected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Conectar'}
                      </span>
                    </button>
                  </motion.div>
                  
                  <p className="mt-6 text-sm text-zinc-500 font-medium">
                    {isConnected 
                      ? `Protegido via ${selectedNetwork.protocol.split(' ')[0]}` 
                      : 'Sua conexão não está protegida'}
                  </p>
                </div>

                {/* Connection Stats */}
                <div className="w-full grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-zinc-800/30 rounded-2xl p-4 flex flex-col items-center justify-center border border-zinc-700/30">
                    <Activity className="w-5 h-5 text-indigo-400 mb-2" />
                    <span className="text-xs text-zinc-500 mb-1">Ping</span>
                    <span className="font-mono text-sm font-medium">{stats.ping} <span className="text-[10px] text-zinc-600">ms</span></span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-2xl p-4 flex flex-col items-center justify-center border border-zinc-700/30">
                    <Wifi className="w-5 h-5 text-emerald-400 mb-2 rotate-180" />
                    <span className="text-xs text-zinc-500 mb-1">Download</span>
                    <span className="font-mono text-sm font-medium">{stats.dl} <span className="text-[10px] text-zinc-600">Mbps</span></span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-2xl p-4 flex flex-col items-center justify-center border border-zinc-700/30">
                    <Wifi className="w-5 h-5 text-rose-400 mb-2" />
                    <span className="text-xs text-zinc-500 mb-1">Upload</span>
                    <span className="font-mono text-sm font-medium">{stats.ul} <span className="text-[10px] text-zinc-600">Mbps</span></span>
                  </div>
                </div>

                {/* Selectors */}
                <div className="w-full space-y-3">
                  <button 
                    onClick={() => setShowServerModal(true)}
                    className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xl">
                        {selectedServer.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-zinc-500 font-medium mb-0.5">Servidor</p>
                        <p className="text-sm font-medium text-zinc-200">{selectedServer.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  </button>

                  <button 
                    onClick={() => setShowNetworkModal(true)}
                    className="w-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-zinc-500 font-medium mb-0.5">Rede / Payload</p>
                        <p className="text-sm font-medium text-zinc-200">{selectedNetwork.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Recursos Premium</h2>
                
                <div className="space-y-4">
                  {/* Split Tunneling */}
                  <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <ShieldAlert className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="font-medium">Split Tunneling</h3>
                      </div>
                      <button 
                        onClick={() => setSplitTunneling(!splitTunneling)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${splitTunneling ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                      >
                        <motion.div 
                          animate={{ x: splitTunneling ? 24 : 2 }}
                          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-500 pl-12">Escolha quais aplicativos passam pela VPN (ex: apenas WhatsApp).</p>
                  </div>

                  {/* Gaming Mode */}
                  <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Gamepad2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="font-medium">Modo Jogo (Low Ping)</h3>
                      </div>
                      <button 
                        onClick={() => setGamingMode(!gamingMode)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${gamingMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                      >
                        <motion.div 
                          animate={{ x: gamingMode ? 24 : 2 }}
                          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-500 pl-12">Otimiza rotas UDP para Free Fire, PUBG e outros jogos.</p>
                  </div>

                  {/* Hotshare */}
                  <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Share2 className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="font-medium">Hotshare (Wi-Fi)</h3>
                      </div>
                      <button 
                        onClick={() => setHotshare(!hotshare)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${hotshare ? 'bg-amber-500' : 'bg-zinc-700'}`}
                      >
                        <motion.div 
                          animate={{ x: hotshare ? 24 : 2 }}
                          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-500 pl-12">Compartilhe a conexão VPN com outros dispositivos via roteador Wi-Fi.</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Versão do App</p>
                  <p className="text-sm font-mono text-zinc-400">v2.0.0 (WireGuard/V2Ray Core)</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Modals */}
        <AnimatePresence>
          {showServerModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col justify-end"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-6 pb-12 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Selecionar Servidor</h3>
                  <button onClick={() => setShowServerModal(false)} className="p-2 bg-zinc-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {SERVERS.map(server => (
                    <button
                      key={server.id}
                      onClick={() => {
                        setSelectedServer(server);
                        setShowServerModal(false);
                      }}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                        selectedServer.id === server.id 
                          ? 'bg-indigo-500/10 border-indigo-500/50' 
                          : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{server.icon}</span>
                        <div className="text-left">
                          <p className="font-medium text-zinc-200">{server.name}</p>
                          <p className="text-xs text-zinc-500">{server.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono ${server.ping < 50 ? 'text-emerald-400' : server.ping < 120 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {server.ping} ms
                        </span>
                        {selectedServer.id === server.id && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showNetworkModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col justify-end"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-6 pb-12 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Configuração de Rede</h3>
                  <button onClick={() => setShowNetworkModal(false)} className="p-2 bg-zinc-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {NETWORKS.map(network => (
                    <button
                      key={network.id}
                      onClick={() => {
                        setSelectedNetwork(network);
                        setShowNetworkModal(false);
                      }}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                        selectedNetwork.id === network.id 
                          ? 'bg-indigo-500/10 border-indigo-500/50' 
                          : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          network.id === 'africell' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-zinc-200">{network.name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{network.protocol}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1">SNI: {network.sni}</p>
                        </div>
                      </div>
                      {selectedNetwork.id === network.id && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    As configurações de SNI e Payloads são atualizadas automaticamente via nuvem para garantir conexão contínua sem necessidade de atualizar o aplicativo.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
